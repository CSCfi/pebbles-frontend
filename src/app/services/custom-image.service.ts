import { Injectable, OnDestroy } from '@angular/core';
import { CustomImage, ImageDefinition } from "../models/custom-image";
import { Observable, throwError } from "rxjs";
import { buildConfiguration } from "../../environments/environment";
import { catchError, map, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CustomImageService implements OnDestroy {
  private customImages: CustomImage[] = null;
  private interval = 0;

  constructor(
    private http: HttpClient,
  ) {
    this.setPollingInterval(60);
  }

  ngOnDestroy(): void {
    this.clearPollingInterval();
  }

  getCustomImages(): CustomImage[] {
    return this.customImages;
  }

  get(id: string): CustomImage {
    return this.customImages.find(ci => ci.id === id);
  }

  fetchCustomImages(): Observable<CustomImage[]> {
    const url = `${buildConfiguration.apiUrl}/custom_images`;

    return this.http.get<CustomImage[]>(url).pipe(
      map((resp) => {
        this.customImages = resp;
        if (this.customImages.find((value) => ['new', 'building'].includes(value.state))) {
          this.setPollingInterval(5);
        } else {
          this.setPollingInterval(60);
        }
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
        // push the new session directly to state and trigger a full refresh later
        this.customImages.push(newImage);
        this.fetchCustomImages().subscribe();
      }));
  }
}
