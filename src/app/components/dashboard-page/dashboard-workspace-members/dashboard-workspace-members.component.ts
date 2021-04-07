import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceUserList } from 'src/app/models/workspace-user-list';

export interface MemberTable {
  select: boolean;
  index: number;
  role: string;
  email: string;
}

@Component({
  selector: 'app-dashboard-workspace-members',
  templateUrl: './dashboard-workspace-members.component.html',
  styleUrls: ['./dashboard-workspace-members.component.scss']
})
export class DashboardWorkspaceMembersComponent implements OnInit, OnChanges {

  @Input() memberList: WorkspaceUserList;
  displayedColumns: string[] = ['select', 'index', 'role', 'email', 'menu'];
  dataSource: MatTableDataSource<MemberTable>;

  selection = new SelectionModel<MemberTable>(true, []);
  tableList = [];

  constructor(
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.tableList = [];
    this.viewMembers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewMembers(): void {
      const workspaceUserKeys = ['owner', 'manager_users', 'normal_users', 'banned_users'];
      const ownerKey = workspaceUserKeys.shift();
      this.tableList.push({
        select: false,
        index: this.tableList.length + 1,
        role: ownerKey,
        eppn: this.memberList[ownerKey].eppn,
      });
      const managerKey = workspaceUserKeys.shift();
      this.memberList[managerKey].forEach((member, index) => {
        if (member.eppn !== this.memberList[ownerKey].eppn) {
          this.tableList.push({
            select: false,
            index: this.tableList.length + 1,
            role: managerKey,
            eppn: member.eppn,
          });
        }
      });
      for (const key of workspaceUserKeys) {
        this.memberList[key].forEach((member, index) => {
          this.tableList.push({
            select: false,
            index: this.tableList.length + 1,
            role: key,
            eppn: member.eppn
          });
        });
      }
      this.dataSource = new MatTableDataSource(this.tableList);
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
