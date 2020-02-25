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
    this.expandTargets = this.querySelectorAll('.list-group-item-action');
    this.expandTargets.forEach( (item) => {
      let detailsEl = item.querySelector('.details');
      detailsEl.setAttribute('data-collapsed', 'true');
      detailsEl.style.height = '0px';
      item.addEventListener('click', this.listen);
      /*let detailsEl = item.querySelector('.details');
      if(detailsEl) {
        setTimeout(function() {
          detailsEl.detailsHeight = detailsEl.scrollHeight;
          detailsEl.style.display = "none";
        }, 30)
      }*/
    });
  }

  listen() { /*
    let detailsEl = this.querySelector('.details');
    let detailsHeight = detailsEl.detailsHeight
    */

    var section = this.querySelector('.details');
    var isCollapsed = section.getAttribute('data-collapsed') === 'true';
      
    if(isCollapsed) {
      expandSection(section);
      section.setAttribute('data-collapsed', 'false');
      this.classList.remove('list-open');
    } else {
      collapseSection(section);
      this.classList.add('list-open');
    }
  }
}

window.customElements.define('cwds-step-list', CWDSStepList);

function collapseSection(element) {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;
  
  // temporarily disable all css transitions
  var elementTransition = element.style.transition;
  element.style.transition = '';
  
  // on the next frame (as soon as the previous style change has taken effect),
  // explicitly set the element's height to its current pixel height, so we 
  // aren't transitioning out of 'auto'
  requestAnimationFrame(function() {
    element.style.height = sectionHeight + 'px';
    element.style.transition = elementTransition;
    
    // on the next frame (as soon as the previous style change has taken effect),
    // have the element transition to height: 0
    requestAnimationFrame(function() {
      element.style.height = 0 + 'px';
    });
  });
  
  // mark the section as "currently collapsed"
  element.setAttribute('data-collapsed', 'true');
}

function expandSection(element) {
  // get the height of the element's inner content, regardless of its actual size
  var sectionHeight = element.scrollHeight;
  
  // have the element transition to the height of its inner content
  element.style.height = sectionHeight + 'px';

  // when the next css transition finishes (which should be the one we just triggered)
  element.addEventListener('transitionend', function(e) {
    // remove this event listener so it only gets triggered once
    element.removeEventListener('transitionend', arguments.callee);
    
    // remove "height" from the element's inline styles, so it can return to its initial value
    element.style.height = null;
  });
  
  // mark the section as "currently not collapsed"
  element.setAttribute('data-collapsed', 'false');
}
