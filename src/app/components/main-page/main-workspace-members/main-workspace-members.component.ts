import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceUserList } from 'src/app/models/workspace-user-list';

export enum UserCategory {
  owner = 'Workspace owner',
  manager_users = 'Workspace co-owner',
  normal_users = 'Workspace user',
  banned_users = 'Banned user'
}

export interface MemberTable {
  select: boolean;
  index: number;
  role: string;
  email: string;
}

@Component({
  selector: 'app-main-workspace-members',
  templateUrl: './main-workspace-members.component.html',
  styleUrls: ['./main-workspace-members.component.scss']
})
export class MainWorkspaceMembersComponent implements OnInit, OnChanges {

  @Input() memberList: WorkspaceUserList;
  displayedColumns: string[] = ['icon', 'role', 'email', 'menu'];
  dataSource: MatTableDataSource<MemberTable>;

  selection = new SelectionModel<MemberTable>(true, []);
  tableList = [];

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tableList = [];
    this.viewMembers();
  }

  getUserCategory(role: string): void {
    return UserCategory[role];
  }

  viewMembers(): void {
    const workspaceUserKeys = ['owner', 'manager_users', 'normal_users', 'banned_users'];
    const ownerKey = workspaceUserKeys.shift();
    this.tableList.push({
      select: false,
      role: ownerKey,
      ext_id: this.memberList[ownerKey].ext_id,
    });
    const managerKey = workspaceUserKeys.shift();
    this.memberList[managerKey].forEach((member, index) => {
      if (member.ext_id !== this.memberList[ownerKey].ext_id) {
        this.tableList.push({
          select: false,
          role: managerKey,
          ext_id: member.ext_id,
        });
      }
    });
    for (const key of workspaceUserKeys) {
      this.memberList[key].forEach((member, index) => {
        this.tableList.push({
          select: false,
          role: key,
          ext_id: member.ext_id
        });
      });
    }
    this.dataSource = new MatTableDataSource(this.tableList);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MemberTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }
}
