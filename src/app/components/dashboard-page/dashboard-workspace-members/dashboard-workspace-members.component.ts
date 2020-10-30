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

  constructor(
    private workspaceService: WorkspaceService
  ) {
  }

  ngOnInit(): void {
    this.fetchMembers();
  }

  applyFilter(event: Event) {
    // Todo: Need to create filtering logic
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchMembers(): void {
    this.workspaceService.fetchMembersByWorkspaceId(this.workspaceId).subscribe((resp) => {
      console.log('members in the workspace fetched');
      const memberTableList = resp.map((member, i) => {
        // ---- authority(+ icon) is for now 'end user'
        // ---- To get value of this, we need to have a logic to detect 'workspace-manager' later.
        return {
          select: false,
          index: i,
          icon: 'account_circle',
          authority: 'end user',
          email: member.eppn,
        };
      });
      this.dataSource = new MatTableDataSource(memberTableList);
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
