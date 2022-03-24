import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';
import { EventService } from '../../../services/event.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { Utilities } from '../../../utilities';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MainWorkspaceQuotaFormComponent } from '../main-workspace-quota-form/main-workspace-quota-form.component';

export interface UserTableRow {
  isSelected: boolean;
  index: number;
  email: string;
  pseudonym: string;
  state: string[];
  isAdmin: boolean;
  workspaceQuota: number;
  workspaceCount: number;
  joiningDate: number;
  expiryDate: number;
  latestLoginDate: number;
}

@Component({
  selector: 'app-main-users',
  templateUrl: './main-users.component.html',
  styleUrls: ['./main-users.component.scss']
})
export class MainUsersComponent implements OnInit, OnDestroy {

  public context: Data;
  private subscriptions: Subscription[] = [];
  public displayedColumns: string[] = [
    'index', 'isSelected', 'email', 'pseudonym', 'state', 'workspaceQuota', 'joiningDate', 'expiryDate', 'lastLoginDate', 'action'
  ];
  public userDataSource: MatTableDataSource<UserTableRow> = null;
  public tableRowData: UserTableRow[] = null;
  public selection = new SelectionModel<UserTableRow>(true, []);
  public queryText = '';
  // ---- Paginator
  public isPaginatorVisible = false;
  public minUnitNumber = 100;
  public pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.userDataSource && !this.userDataSource.sort) {
        this.userDataSource.sort = sort;
    }
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private eventService: EventService,
    private accountService: AccountService,
    private workspaceService: WorkspaceService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.subscriptions.push(this.eventService.userDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
    this.subscriptions.push(this.eventService.workspaceDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
    this.refreshUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.map(x => x.unsubscribe());
  }

  refreshUsers(): void {
    this.accountService.fetchUsers();
  }

  rebuildDataSource(): void {
    // we need the service to be populated before actually setting data
    if (!this.accountService.getUsers()) {
      return;
    }
    // wait for paginator to be initialized by Angular, otherwise defer to next tick
    if (!this.paginator) {
      setTimeout(_ => this.rebuildDataSource(), 0);
      return;
    }
    this.tableRowData = this.composeDataSource(this.accountService.getUsers());
    // create a new datasource to trigger table rendering
    this.userDataSource = new MatTableDataSource<UserTableRow>(this.tableRowData);
    this.userDataSource.filter = Utilities.cleanText(this.queryText);
    setTimeout(_=> {
      this.userDataSource.paginator = this.paginator;
      // ---- Paginator becomes invisible after data has been inserted
      this.isPaginatorVisible = this.tableRowData.length > this.minUnitNumber;
      this.pageSizeOptions = Utilities.getPageSizeOptions(this.userDataSource, this.minUnitNumber);
      }, 0);
  }

  private getLabels(user): string[] {
    const labels = [];
    if (user.is_admin) {
      labels.push('admin');
    }
    if (user.is_blocked) {
      labels.push('blocked');
    }
    if (user.workspace_quota > 0) {
      labels.push('owner');
    }
    if (!user.is_active) {
      labels.push('inactive');
    }
    if (user.is_deleted) {
      labels.push('deleted');
    }
    return labels;
  }

  private getWorkspaceCount(user): Number {
    if (user.is_admin) {
      // ---- admin has default.workspace additionally
      return Number(this.workspaceService.getOwnedWorkspaces(user).length) + 1;
    }
    if (user.workspace_quota > 0) {
      return this.workspaceService.getOwnedWorkspaces(user).length;
    }
    return 0;
  }

  composeDataSource(data: User[]): UserTableRow[] {
    if (!data) {
      return [];
    }
    const returns = [];
    let index = 0;
    data.forEach((user) => {
        index = index + 1;
        returns.push({
          isSelected: false,
          index,
          id: user.id,
          email: user.ext_id,
          pseudonym: user.pseudonym,
          state: this.getLabels(user),
          isAdmin: user.is_admin,
          isBlocked: user.is_blocked,
          isDeleted: user.is_deleted,
          workspaceQuota: user.is_admin ? 'Unlimited' : user.workspace_quota,
          workspaceCount: this.getWorkspaceCount(user),
          joiningDate: user.joining_ts,
          expiryDate: user.expiry_ts,
          lastLoginDate: user.last_login_ts
        });
      });
    return returns;
  }

  applyFilter(value: string ): void {
    this.queryText = value;
    this.selection.clear();
    this.rebuildDataSource();
  }

  OpenWorkspaceQuotaDialog(userId: string, email: string, workspaceCount: number, workspaceQuota: number): void {
    this.dialog.open(MainWorkspaceQuotaFormComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '90vh',
      autoFocus: false,
      data: {
        userId,
        email,
        workspaceCount,
        workspaceQuota
      }
    }).afterClosed().subscribe(_ => {
      this.rebuildDataSource();
    });
  }

  openRemoveUserDialog(selectedUsers: UserTableRow[]): void {
    let emailList = '';
    selectedUsers.forEach( user => {
      emailList += `<li>${ user.email }</li>`;
    });

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm user removal',
        dialogContent: `<p>Are you sure to remove the users below?</p><ul>${emailList}</ul>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.accountService.removeUsers(selectedUsers);
        this.selection.clear();
      }
    });
  }

  openBlockUserDialog(userId: string, email: string, isBlocked: boolean) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        dialogTitle: 'Confirm user state change!',
        dialogContent: `<p>Are you sure to ${ !isBlocked ? 'BLOCK' : 'UNBLOCK' } the user "${email}"?</p>`,
        dialogActions: ['confirm', 'cancel']
      }
    });
    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.accountService.toggleBlockUser(userId, isBlocked).subscribe( _ => {
          this.rebuildDataSource();
        });
      }
    });
  }

   /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.userDataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.tableRowData.forEach(row => this.selection.select(row));
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: UserTableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }
}
