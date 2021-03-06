import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { FaqService } from '../../../services/faq.service';
import { Content, Faq } from 'src/app/models/faq';
import { PublicConfigService } from '../../../services/public-config.service';
import { Utilities } from '../../../utilities';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-main-help',
  templateUrl: './main-help.component.html',
  styleUrls: ['./main-help.component.scss']
})
export class MainHelpComponent implements OnInit {

  public context: Data;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public queryText = '';
  public isAllExpanded = false;
  public index = 0;
  public selectedTab = 0;
  public contentLabels = ['faq', 'documentation', 'contact'];
  public faqTopics: Faq[];
  public indexExpanded: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public faqService: FaqService,
    public publicConfigService: PublicConfigService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.context = data;
    });
    this.faqService.fetchFaqs().subscribe(_ => {
      this.resetFaqs();
    });
    // restore content selection from queryParams if available
    this.activatedRoute.queryParamMap.subscribe(paramMap => {
      if (paramMap.get('content')) {
        this.selectedTab = this.contentLabels.indexOf(paramMap.get('content'));
      }
    });
  }

  resetFaqs(): void {
    this.faqService.getFaqs();
    this.faqTopics = this.faqService.getFaqs().map(topic => {
      const newTopic = new Faq(topic.name, []);
      newTopic.content = topic.content.map(item => {
        return {
          answer: Utilities.resetText(item.answer),
          question: Utilities.resetText(item.question)
        };
      });
      return newTopic;
    });
  }

  search(): void {
    this.resetFaqs();
    if (this.queryText === '') {
      this.isAllExpanded = false;
    } else {
      const faqs_result = this.faqTopics.map(topic => {
        topic.content = this.filterFaqsByText(topic.content, this.queryText);
        return topic;
      });
      this.isAllExpanded = true;
      this.faqTopics = faqs_result;
    }
  }

  applyFilter(value): void {
    this.queryText = value;
    this.search();
  }

  handleTabChange($event: MatTabChangeEvent) {
    this.selectedTab = $event.index;

    // save the workspace selection in url parameters to restore navigation state after a reload
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {content: this.contentLabels[this.selectedTab]},
      queryParamsHandling: 'merge'
    });
  }

  focusTab(idx: number): void {
    if (!this.tabGroup) {
      setTimeout(_ => this.focusTab(idx), 0);
      return;
    }
    this.tabGroup.selectedIndex = idx;
  }

  filterFaqsByText(objects: Content[], term: string): Content[] {
    term = Utilities.cleanText(term);
    if (term === '') {
      return objects;
    } else {
      objects = objects.filter(obj => {
        let isMatch = false;
        // ---- Search in question
        if (Utilities.cleanText(obj.question).indexOf(term) > -1) {
          obj.question = obj.question.replace(new RegExp(term, 'gi'), (match) => `<mark>${match}</mark>`);
          isMatch = true;
        }
        // ---- Search in answer
        if (Utilities.cleanText(obj.answer).indexOf(term) > -1) {
          obj.answer = obj.answer.replace(new RegExp(term, 'gi'), (match) => `<mark>${match}</mark>`);
          isMatch = true;
        }
        if (isMatch) {
          return obj;
        }
      });
    }
    return objects;
  }

  togglePanels(index: string) {
    this.indexExpanded = index === this.indexExpanded ? null : index;
  }
}
