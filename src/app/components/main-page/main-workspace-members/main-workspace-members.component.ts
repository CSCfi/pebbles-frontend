import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../models/user';
import { UserAssociationType, Workspace, WorkspaceMember } from '../../../models/workspace';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { Utilities } from '../../../utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export interface MemberRow {
  index: number;
  select: boolean;
  role: string;
  email: string;
  userId: string;
}

@Component({
  selector: 'app-main-workspace-members',
  templateUrl: './main-workspace-members.component.html',
  styleUrls: ['./main-workspace-members.component.scss']
})
export class MainWorkspaceMembersComponent implements OnInit, OnChanges, OnDestroy {
  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['index', 'role', 'email', 'menu'];
  memberDataSource: MatTableDataSource<MemberRow>;
  selection = new SelectionModel<MemberRow>(true, []);
  memberList: MemberRow[] = null;
  user: User;

  // ---- Paginator
  isPaginatorVisible = true;
  minUnitNumber = 25;
  pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() workspace: Workspace;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private accountService: AccountService,
    private workspaceService: WorkspaceService,
    private eventService: EventService
  ) {
  }

  ngOnInit(): void {
    this.user = this.accountService.get(this.authService.getUserId());
    this.subscriptions.push(this.eventService.workspaceMemberDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever our @Input changes, we rebuild our table data source
    if (this.workspaceService.getWorkspaceMembers(this.workspace.id)) {
      this.rebuildDataSource();
    } else {
      // workspace members are not eagerly loaded (the list might be very long),
      // so if workspaceService does not already have the list we trigger the fetch
      this.refreshMembers();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(x => x.unsubscribe());
  }

  refreshMembers(): void {
    if (this.workspace.id) {
      this.workspaceService.refreshWorkspaceMembers(this.workspace.id);
    }
    // set the data to null to clear possible old data from the previous selection and to render 'loading' message
    this.memberDataSource = null;
    this.memberList = null;
  }

  rebuildDataSource(): void {
    // we need the service to be populated before actually setting data
    if (!this.workspaceService.getWorkspaceMembers(this.workspace.id)) {
      return;
    }
    // wait for paginator to be initialized by Angular, otherwise defer to next tick
    if (!this.paginator) {
      setTimeout(_ => this.rebuildDataSource(), 0);
      return;
    }
    this.memberList = this.composeDataSource(this.workspaceService.getWorkspaceMembers(this.workspace.id));
    this.memberDataSource = new MatTableDataSource(this.memberList);
    this.memberDataSource.paginator = this.paginator;
    // ---- Paginator becomes invisible after data has been inserted
    this.isPaginatorVisible = this.memberList.length > this.minUnitNumber;
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.memberDataSource, this.minUnitNumber);
  }

  composeDataSource(members: WorkspaceMember[]): MemberRow[] {
    if (!members) {
      return [];
    }

    const rows = [];
    let index = 0;

    // ---- to locate your account in the top of the list before indexing
    members.sort((x, y) => {
      return (x.ext_id === this.user.ext_id) ? -1 : (y.ext_id === this.user.ext_id) ? 1 : 0;
    });

    members.forEach((member) => {
      index = index + 1;
      let role = 'member';
      if (member.is_banned) {
        role = 'banned';
      } else if (member.is_owner) {
        role = 'owner';
      } else if (member.is_manager) {
        role = 'manager';
      }
      rows.push({
        index,
        select: false,
        role,
        email: member.ext_id,
        userId: member.user_id
      });
    });
    return rows;
  }

  setIsBanned(userId: string, isBanned: boolean): void {
    this.workspaceService.setIsBanned(this.workspace.id, userId, isBanned).subscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberDataSource.filter = filterValue.trim().toLowerCase();

    if (this.memberDataSource.paginator) {
      this.memberDataSource.paginator.firstPage();
    }
  }

  displayUserAssociationType(role): string {
    return role === UserAssociationType.Manager ? 'co-owner' : role;
  }

  isTransferOwnerActive(role): boolean {
    return  (this.user?.is_admin || this.workspace.user_association_type === 'owner');
  }

  transferOwnership(userId: string, email: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm transfer ownership',
        dialogContent: `<p>Are you sure to transfer ownership to <b class="txt__warn-dark">${email}</b> ?</p>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.workspaceService.transferOwnership(this.workspace.id, userId).subscribe();
      }
    });
  }

  isPromoteCoOwnerActive(role): boolean {
    return role === 'member' && this.workspace.user_association_type !== 'public';
  }

  promoteMember(userId: string): void {
    this.workspaceService.promoteMember(this.workspace.id, userId).subscribe();
  }

  isDemoteCoOwnerActive(role): boolean {
    return role === 'manager';
  }

  demoteManager(userId: string): void {
    if (userId === this.user.id && !this.user.is_admin) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        autoFocus: false,
        data: {
          dialogTitle: 'Warning!',
          dialogContent: `<p>Are you sure to give up a control right to this workspace?</p>`,
          dialogActions: ['confirm', 'cancel']
        }
      });
      dialogRef.afterClosed().subscribe(params => {
        if (params) {
          this.workspaceService.demoteMember(this.workspace.id, userId).subscribe();
        }
      });
    } else {
      this.workspaceService.demoteMember(this.workspace.id, userId).subscribe();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected(): boolean {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.memberDataSource.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle(): void {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.memberDataSource.data.forEach(row => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: MemberTable): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  // }
}
