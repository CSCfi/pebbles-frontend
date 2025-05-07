import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { User, UserRole } from 'src/app/models/user';
import { MembershipType, Workspace, WorkspaceMember } from 'src/app/models/workspace';
import { AccountService } from 'src/app/services/account.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { SearchService } from 'src/app/services/search.service';
import { WorkspaceService } from 'src/app/services/workspace.service';
import { Utilities } from 'src/app/utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';

export interface MemberRow {
  index: number;
  select: boolean;
  role: string;
  displayRole: string;
  email: string;
  userId: string;
}

@Component({
  selector: 'app-main-workspace-members',
  templateUrl: './main-workspace-members.component.html',
  styleUrls: ['./main-workspace-members.component.scss']
})
export class MainWorkspaceMembersComponent implements OnInit, OnChanges, OnDestroy {

  @Input() workspace: Workspace;

  // store subscriptions here for unsubscribing at destroy time
  private subscriptions: Subscription[] = [];

  public displayedColumns: string[] = ['index', 'role', 'email', 'menu'];
  public memberDataSource: MatTableDataSource<MemberRow>;
  public selection = new SelectionModel<MemberRow>(true, []);
  public memberList: MemberRow[] = null;
  public user: User;
  private queryText = '';

  // ---- Paginator
  public isPaginatorVisible = true;
  private minUnitNumber = 25;
  public pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public get isInviteHintEnabled(): boolean {
    return this.memberList?.length < 2;
  }

  public sortCondition: Sort = {
    direction: 'asc',
    active: 'index'
  };
  private roleOrder: UserRole[] = [
      UserRole.Owner, UserRole.Manager, UserRole.Member, UserRole.Banned];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private accountService: AccountService,
    private workspaceService: WorkspaceService,
    private eventService: EventService,
    private searchService: SearchService
  ) {
  }

  ngOnInit(): void {
    this.user = this.accountService.get(this.authService.getUserId());
    this.subscriptions.push(this.eventService.workspaceMemberDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
  }

  ngOnChanges(): void {
    // Whenever @Input workspace changes -> rebuild table data source
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
      setTimeout(() => this.rebuildDataSource(), 0);
      return;
    }
    this.memberList = this.composeDataSource(this.workspaceService.getWorkspaceMembers(this.workspace.id));
    // create a new datasource to trigger table rendering
    let sortingMemberList = this.memberList.slice();
    this.sortData(sortingMemberList, this.sortCondition);
    sortingMemberList = this.searchService.filterByText(sortingMemberList, this.queryText, ['email', 'displayRole']);
    this.memberDataSource = new MatTableDataSource(sortingMemberList);
    this.memberDataSource.filter = Utilities.cleanText(this.queryText);
    this.memberDataSource.paginator = this.paginator;
    // ---- Paginator becomes invisible after data has been inserted
    this.isPaginatorVisible = this.memberDataSource.filteredData.length > this.minUnitNumber;
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.memberDataSource, this.minUnitNumber);
  }

  composeDataSource(members: WorkspaceMember[]): MemberRow[] {
    if (!members) {
      return [];
    }
    const rows = [];
    // ---- to locate your account in the top of the list before indexing
    members.forEach(member => {
      let role = UserRole.Member;

      if (member.is_banned) {
        role = UserRole.Banned;
      } else if (member.is_owner) {
        role = UserRole.Owner;
      } else if (member.is_manager) {
        role = UserRole.Manager;
      }
      rows.push({
        userId: member.user_id,
        email: member.ext_id,
        select: false,
        role,
        displayRole: role
      })
    });

    // ---- sort based on the user-role
    rows.sort((x, y) => {
      return (this.roleOrder.indexOf(x.role) - this.roleOrder.indexOf(y.role));
    });

    // ---- to locate your account in the top of the list before indexing
    rows.sort((x, y) => {
      return (x.email === this.user.ext_id) ? -1 : (y.email === this.user.ext_id) ? 1 : 0;
    });

    rows.map((row, index) => {
      row.index = index + 1;
    });

    return rows;
  }

  setIsBanned(userId: string, isBanned: boolean): void {
    this.workspaceService.setIsBanned(this.workspace.id, userId, isBanned).subscribe();
  }

  applyFilter(event: Event): void {
    this.queryText = (event.target as HTMLInputElement).value;
    this.selection.clear();
    this.rebuildDataSource()
  }

  displayMembershipType(role: string): string {
    return role === MembershipType.Manager ? 'co-owner' : role;
  }

  isTransferOwnerActive(): boolean {
    return (this.user?.is_admin || this.workspace.membership_type === MembershipType.Owner);
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

  isPromoteCoOwnerActive(role: string): boolean {
    return role === UserRole.Member && this.workspace.membership_type !== MembershipType.Public;
  }

  promoteMember(userId: string): void {
    this.workspaceService.promoteMember(this.workspace.id, userId).subscribe();
  }

  isDemoteCoOwnerActive(role: string): boolean {
    return role === UserRole.Manager;
  }

  demoteManager(userId: string): void {
    if (userId === this.user.id && !this.user.is_admin) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '500px',
        autoFocus: false,
        data: {
          dialogTitle: 'Warning!',
          dialogContent: `<p>Are you sure to give up control rights to this workspace?</p>`,
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

  changeSortCondition(sort: Sort): void {
    this.sortCondition = {
      direction: sort.direction,
      active: sort.active
    };
    this.rebuildDataSource();
  }

  sortData(data: MemberRow[], sort: Sort) {
    if (sort.active && sort.direction !== '') {
      data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'index':
            return Utilities.compare(a.index, b.index, isAsc);
          case 'role':
            if (a.role === b.role) return b.index - a.index;
            return (this.roleOrder.indexOf(<UserRole>a.role) - this.roleOrder.indexOf(<UserRole>b.role)) * (isAsc ? 1 : -1);
          default:
            return 0;
        }
      });
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
