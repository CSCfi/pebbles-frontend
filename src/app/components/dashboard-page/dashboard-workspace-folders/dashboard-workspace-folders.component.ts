import { Component, Input, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from 'src/app/services/workspace.service';

export interface FolderTable {
  select: boolean;
  index: number;
  type: string;
  size: string;
  owner: string;
}

@Component({
  selector: 'app-dashboard-workspace-folders',
  templateUrl: './dashboard-workspace-folders.component.html',
  styleUrls: ['./dashboard-workspace-folders.component.scss']
})
export class DashboardWorkspaceFoldersComponent implements OnInit {

  @Input() workspaceId: string;
  displayedColumns: string[] = ['select', 'index', 'name', 'capacity', 'created_by', 'action'];
  dataSource = new MatTableDataSource<FolderTable>();
  selection = new SelectionModel<FolderTable>(true, []);
  tableList = [];

  constructor(
    private workspaceService: WorkspaceService,
  ) {
  }

  ngOnInit(): void {
    this.fetchFolders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchFolders(): void {
    this.workspaceService.fetchFoldersByWorkspaceId(this.workspaceId).subscribe((resp) => {
      console.log('Files in the workspace fetched');
      this.tableList = resp.map((folder, i) => {
        return {
          select: false,
          index: i,
          name: folder.name,
          capacity: folder.capacity,
          created_by: folder.created_by
        };
      });
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
  checkboxLabel(row?: FolderTable): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  }

}
