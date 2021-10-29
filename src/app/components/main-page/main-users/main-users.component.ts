import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  public content = {
    path: 'users',
    title: 'Manage users',
    identifier: 'users'
  };

  private subscriptions: Subscription[] = [];
  public displayedColumns: string[] = [
    'index', 'isSelected', 'email', 'state', 'workspaceQuota', 'joiningDate', 'expiryDate', 'lastLoginDate', 'action'
  ];
  public dataSource: MatTableDataSource<UserTableRow>;
  public tableRowData: UserTableRow[] = null;
  public selection = new SelectionModel<UserTableRow>(true, []);

  queryText = '';
  // ---- Paginator
  public isPaginatorVisible = false;
  public minUnitNumber = 100;
  public pageSizeOptions = [this.minUnitNumber];
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource && !this.dataSource.sort) {
        this.dataSource.sort = sort;
    }
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private accountService: AccountService,
    private workspaceService: WorkspaceService,
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.eventService.userDataUpdate$.subscribe(_ => {
      this.rebuildDataSource();
    }));
    this.refreshUsers();
  }

  ngOnDestroy(): void {
    this.subscriptions.map(x => x.unsubscribe());
  }

  refreshUsers(): void {
    this.accountService.fetchUsers();
    // set the data to null to clear possible old data from the previous selection and to render 'loading' message
    this.dataSource = null;
    this.tableRowData = null;
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
    console.log('rebuildDataSource()');
    this.tableRowData = this.composeDataSource(this.accountService.getUsers());
    this.dataSource = new MatTableDataSource<UserTableRow>(this.tableRowData);
    this.dataSource.filter = Utilities.cleanText(this.queryText);
    this.tableRowData = this.dataSource.filteredData;
    this.dataSource.paginator = this.paginator;
    // ---- Paginator becomes invisible after data has been inserted
    this.isPaginatorVisible = this.tableRowData.length > this.minUnitNumber;
    this.pageSizeOptions = Utilities.getPageSizeOptions(this.dataSource, this.minUnitNumber);
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

  private getWorkspaceCount(user): string {
    if (user.is_admin) {
      // ---- admin has default.workspace additionally
      const count = Number(this.workspaceService.getOwnedWorkspaces(user).length) + 1;
      return count + ' / ';
    }
    if (user.workspace_quota > 0) {
      return this.workspaceService.getOwnedWorkspaces(user).length + ' / ';
    }
    return '';
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
          console.log('The user has been blocked.');
          this.rebuildDataSource();
        });
      }
    });
  }

   /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
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
