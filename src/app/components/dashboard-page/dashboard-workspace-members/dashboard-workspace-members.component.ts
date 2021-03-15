import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from 'src/app/services/workspace.service';

export interface MemberTable {
  select: boolean;
  index: number;
  icon: string;
  email: string;
  authority: string;
}

@Component({
  selector: 'app-dashboard-workspace-members',
  templateUrl: './dashboard-workspace-members.component.html',
  styleUrls: ['./dashboard-workspace-members.component.scss']
})
export class DashboardWorkspaceMembersComponent implements OnInit {

  @Input() workspaceId: string;
  displayedColumns: string[] = ['select', 'index', 'icon', 'email', 'authority'];
  dataSource: MatTableDataSource<MemberTable>;
  selection = new SelectionModel<MemberTable>(true, []);
  tableList = [];

  constructor(
    private workspaceService: WorkspaceService
  ) {
  }

  ngOnInit(): void {
    this.fetchMembers();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchMembers(): void {
    this.workspaceService.fetchMembersByWorkspaceId(this.workspaceId).subscribe((resp) => {
      console.log('members in the workspace fetched');
      const workspaceUserKeys = ['owner', 'manager_users', 'normal_users', 'banned_users'];
      const ownerKey = workspaceUserKeys.shift();
      this.tableList.push({
          select: false,
          index: this.tableList.length,
          icon: 'account_circle',
          authority: ownerKey,
          email: resp[ownerKey].eppn,
          });
      const managerKey = workspaceUserKeys.shift();
      resp[managerKey].forEach((member, index) => {
        if (member.eppn !== resp[ownerKey].eppn) {
          this.tableList.push({
              select: false,
              index: this.tableList.length,
              icon: 'account_circle',
              authority: managerKey,
              email: member.eppn,
              });
        }
      });
      for (const key of workspaceUserKeys) {
        resp[key].forEach((member, index) => {
        this.tableList.push({
            select: false,
            index: this.tableList.length,
            icon: 'account_circle',
            authority: key,
            email: member.eppn,
            });
        });
      }
      this.dataSource = new MatTableDataSource(this.tableList);
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
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
