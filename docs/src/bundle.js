'use strict';

class CWDSAccordion extends HTMLElement {
  connectedCallback() {
    this.expandTarget = this.querySelector('.card-container');
    this.expandButton = this.querySelector('.card-header');
    this.expandButton.addEventListener('click', this.listen.bind(this));
  }

  listen() {
    if(!this.cardBodyHeight) {
      this.cardBodyHeight = this.querySelector('.card-body').clientHeight;
    }
    if(this.expandTarget.clientHeight > 0) {
      this.expandTarget.style.height = '0px';
      this.querySelector('.card-header').classList.remove('accordion-alpha-open');
      let expando = this.expandTarget;
      setTimeout(function() {
        expando.style.display = "none";
      }, 300);
    } else {
      this.expandTarget.style.display = "block";
      this.expandTarget.style.height = this.cardBodyHeight+'px';
      this.querySelector('.card-header').classList.add('accordion-alpha-open');
    }
  }
}
window.customElements.define('cwds-accordion', CWDSAccordion);

class CWDSStepList extends HTMLElement {
  connectedCallback() {
    this.expandTargets = this.querySelectorAll('li');
    this.expandTargets.forEach( (item) => {
      item.addEventListener('click', this.listen);
      let detailsEl = item.querySelector('.details');
      if(detailsEl) {
        setTimeout(function() {
          detailsEl.detailsHeight = detailsEl.scrollHeight;
          detailsEl.style.display = "none";  
        },30)
      }
    });
  }

  listen() {
    console.log(this)
    let detailsEl = this.querySelector('.details');
    let detailsHeight = detailsEl.detailsHeight;

    if(this.classList.contains('list-open')) {
      this.classList.remove('list-open');
    } else {
      this.classList.add('list-open');
    }
    if(!detailsEl.style.height || detailsEl.style.height.indexOf('0px') == 0) {
      detailsEl.style.display = "block";
      // need to timeout here to prevent the browser from grouping these two statements and killing the animation
      setTimeout(function() {
        detailsEl.style.height = detailsHeight + 'px';
      }, 20);
    } else {
      detailsEl.style.height = 0;
      // timeout here to give animation time to complete before hide
      setTimeout(function() {
        detailsEl.style.display = "none";
      }, 300);

    }
  }
}
window.customElements.define('cwds-step-list', CWDSStepList);
