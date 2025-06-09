import { Injectable, OnDestroy } from '@angular/core';
import { BuildState, CustomImage, ImageDefinition } from "../models/custom-image";
import { Observable, throwError } from "rxjs";
import { buildConfiguration } from "../../environments/environment";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { EventService } from "./event.service";

@Injectable({
  providedIn: 'root'
})
export class CustomImageService implements OnDestroy {
  private customImages: CustomImage[] = null;
  private interval = 0;

  constructor(
    private http: HttpClient,
    private eventService: EventService
  ) {
    this.setPollingInterval(60);
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  get(id: string): CustomImage {
    return this.customImages.find(ci => ci.id === id);
  }

  getCustomImagesByWorkspaceId(workspaceId: string): CustomImage[] {
    return this.customImages ? this.customImages.filter(ci => ci.workspace_id === workspaceId) : [];
  }

  fetchCustomImages(): Observable<CustomImage[]> {
    const url = `${buildConfiguration.apiUrl}/custom_images`;
    return this.http.get<CustomImage[]>(url).pipe(
      map(cis => {
        cis.forEach((ci) => {
          if (ci.to_be_deleted) ci.state = BuildState.Deleting;
        });
        const hasUpdatingState = cis.some((item) => {
          return [BuildState.New, BuildState.Building, BuildState.Deleting].includes(item.state);
        });
        if (hasUpdatingState) {
          this.setPollingInterval(5);
        } else {
          this.setPollingInterval(60);
        }
        this.customImages = cis;
        this.eventService.customImageDataUpdate$.next('all');
        return this.customImages;
      }),
      catchError(err => {
        if (err.status === 401) {
          this.clearPollingInterval();
        }
        return throwError('Error fetching custom images');
      })
    );
  }

  deleteCustomImage(id: string): Observable<CustomImage> {
    const url = `${buildConfiguration.apiUrl}/custom_images/${id}`;
    return this.http.delete<CustomImage>(url).pipe(
      tap(() => {
        this.get(id).to_be_deleted = true;
        this.fetchCustomImages().subscribe();
      })
    );
  }

  setPollingInterval(seconds: number): void {
    this.clearPollingInterval();
    this.interval = window.setInterval(() => {
      this.fetchCustomImages().subscribe();
    }, seconds * 1000);
  }

  clearPollingInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = 0;
    }
  }

  createCustomImage(name: string, workspaceId: string, definition: ImageDefinition): Observable<CustomImage> {
    const url = `${buildConfiguration.apiUrl}/custom_images`;

    return this.http.post<CustomImage>(
      url,
      {name: name, workspace_id: workspaceId, definition: definition}
    ).pipe(
      tap(newImage => {
        // push the new image directly to state and trigger a full refresh later
        this.customImages.push(newImage);
        this.fetchCustomImages().subscribe();
      }));
  }
}
