import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicConfigService {
  private publicConfig: Map<string, string> = null;

  constructor(
    private http: HttpClient
  ) {
    this.fetchPublicConfig().subscribe();
  }

  getPublicConfig(): Map<string, string> {
    return this.publicConfig;
  }

  getInstallationName(): string {
    const configName = this.publicConfig?.get('INSTALLATION_NAME');
    if (!configName) {
      return 'Notebooks';
    }
    // if we have whitespace, split there
    const spaceIndex = configName.indexOf(' ');
    if (spaceIndex >= 0) {
      return configName.substr(0, spaceIndex);
    }
    // secondary split: dot
    const dotIndex = configName.indexOf('.');
    if (dotIndex >= 0) {
      return configName.substr(0, dotIndex);
    }
    // no splitting
    return configName;
  }

  getInstallationDomain(): string {
    const configName = this.publicConfig?.get('INSTALLATION_NAME');
    if (!configName) {
      return null;
    }
    // if we have whitespace, split there
    const spaceIndex = configName.indexOf(' ');
    if (spaceIndex >= 0) {
      return configName.substr(spaceIndex);
    }
    // secondary split: dot
    const dotIndex = configName.indexOf('.');
    if (dotIndex >= 0) {
      return configName.substr(dotIndex);
    }
    // no domain
    return null;
  }

  getShortDescription(): string {
    return this.publicConfig?.get('SHORT_DESCRIPTION');
  }

  getInstallationDescription(): string {
    return this.publicConfig?.get('INSTALLATION_DESCRIPTION');
  }

  getServiceAnnouncement(): string {
    // split INSTALLATION_DESCRIPTION and return the second part
    return this.publicConfig?.get('SERVICE_ANNOUNCEMENT');
  }

  getCourseRequestFormUrl(): string {
    return this.publicConfig?.get('COURSE_REQUEST_FORM_URL');
  }

  getTermsOfUseUrl(): string {
    return this.publicConfig?.get('TERMS_OF_USE_URL');
  }

  getAccessibilityStatementUrl(): string {
    return this.publicConfig?.get('ACCESSIBILITY_STATEMENT_URL');
  }

  getContactEmail(): string {
    return this.publicConfig?.get('CONTACT_EMAIL');
  }

  getServiceDocumentationUrl(): string {
    return this.publicConfig?.get('SERVICE_DOCUMENTATION_URL');
  }

  fetchPublicConfig(): Observable<any> {
    const url = `${buildConfiguration.apiUrl}/config`;
    return this.http.get(url).pipe(
      tap(res => {
        this.publicConfig = new Map<string, string>();
        for (const entry of res) {
          this.publicConfig.set(entry.key, entry.value);
        }
      })
    );
  }

}
