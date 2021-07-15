import { OnChanges, Component, Input, ViewChild, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkspaceService } from '../../../services/workspace.service';

export enum UserCategory {
  owner = 'Workspace owner',
  manager_users = 'Workspace co-owner',
  normal_users = 'Workspace user',
  banned_users = 'Banned user'
}

export interface MemberTable {
  index: number;
  select: boolean;
  role: string;
  email: string;
}

@Component({
  selector: 'app-main-workspace-members',
  templateUrl: './main-workspace-members.component.html',
  styleUrls: ['./main-workspace-members.component.scss']
})
export class MainWorkspaceMembersComponent implements OnChanges {

  displayedColumns: string[] = ['index', 'icon', 'role', 'email', 'action'];
  dataSource: MatTableDataSource<MemberTable>;
  selection = new SelectionModel<MemberTable>(true, []);
  memberList: MemberTable[] = [];

  // ---- Paginator
  isPaginatorVisible = true;
  minUnitNumber = 10;

  @Input() workspaceId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  get pageSizeOptions(): number[]{
    if (this.dataSource) {
      const unitNumbers = [];
      for ( let i = 1; i < this.dataSource.data.length / this.minUnitNumber; i++) {
        unitNumbers.push(this.minUnitNumber * i);
      }
      unitNumbers.push(this.dataSource.data.length);
      return unitNumbers;
    }
    return [this.minUnitNumber];
  }

  constructor(
    private workspaceService: WorkspaceService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.workspaceService.fetchMembersByWorkspaceId(changes.workspaceId.currentValue).subscribe(resp => {
      this.memberList = this.composeDataSource(resp);
      this.dataSource = new MatTableDataSource(this.memberList);
      this.dataSource.paginator = this.paginator;
      // ---- Pagenator becomes invisible after data has been inserted
      this.isPaginatorVisible = this.memberList.length > this.minUnitNumber ? true : false;
    });
  }

  getUserCategory(role: string): string {
    return UserCategory[role];
  }

  composeDataSource(data): MemberTable[] {
    const workspaceUserKeys = ['owner', 'manager_users', 'normal_users', 'banned_users'];
    const ownerKey = workspaceUserKeys.shift();
    const returns = [];
    let index = 1;
    returns.push({
      index,
      select: false,
      role: ownerKey,
      email: data[ownerKey].ext_id,
    });
    const managerKey = workspaceUserKeys.shift();
    data[managerKey].forEach((member) => {
      if (member.ext_id !== data[ownerKey].ext_id) {
        index = index + 1;
        returns.push({
          index,
          select: false,
          role: managerKey,
          email: member.ext_id,
        });
      }
    });
    for (const key of workspaceUserKeys) {
      data[key].forEach((member) => {
        index = index + 1;
        returns.push({
          index,
          select: false,
          role: key,
          email: member.ext_id
        });
      });
    }
    return returns;
  }

  // applyFilter(event: Event): void {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  /** Whether the number of selected elements matches the total number of rows. */
  // isAllSelected(): boolean {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle(): void {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.dataSource.data.forEach(row => this.selection.select(row));
  // }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: MemberTable): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.index + 1}`;
  // }
}
