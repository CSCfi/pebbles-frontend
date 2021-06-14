import { Component, OnInit, ViewChild } from '@angular/core';
import { FaqService } from '../../../services/faq.service';
import { Content, Faq } from 'src/app/models/faq';
import { Utilities } from '../../../utilities';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-main-help-faq',
  templateUrl: './main-help-faq.component.html',
  styleUrls: ['./main-help-faq.component.scss']
})
export class MainHelpFaqComponent implements OnInit {

  public content = {
    path: 'help/faq',
    title: 'Help: FAQ',
    identifier: 'help-faq'
  };

  @ViewChild(MatAccordion) accordion: MatAccordion;
  queryText = '';
  isAllExpanded = false;
  public browserRefresh: boolean;

  get faqs(): Faq[] {
    const faqTopics = this.faqService.getFaqs().map(faqTopic => {
      faqTopic.content = faqTopic.content.map(item => {
        item.question = Utilities.resetText(item.question);
        item.answer = Utilities.resetText(item.answer);
        return item;
      });
      return faqTopic;
    });
    if (this.queryText === '') {
      this.isAllExpanded = false;
      return faqTopics;
    } else {
      const faqs_result = faqTopics.map(faqTopic => {
        faqTopic.content = this.filterFaqsByText(faqTopic.content, this.queryText);
        return faqTopic;
      });
      this.isAllExpanded = true;
      return faqs_result;
    }
  }

  constructor(
    public  faqService: FaqService
  ) { }

  ngOnInit(): void {
    this.faqService.fetchFaqs().subscribe();
  }

  applyFilter(value): void {
    this.queryText = value;
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
}
