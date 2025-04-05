(() => {
  let picker, mainScrollable, navScrollable;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function setPickerWidth(value) {
    picker.style.width = `${value}px`;
    picker.parentElement.style.width = `${value}px`;
  }
  
  function setPickerHeight(value) {
    picker.style.height = `${value}px`;
    mainScrollable.style.setProperty('height', `${value-50}px`, 'important');
    navScrollable.style.setProperty('height', `${value-100}px`, 'important');
  }

  function _createResizer(element, minWidth, minHeight) {
    const resizer = document.createElement('div');
    resizer.style.position = 'absolute';
    resizer.style.top = '0';
    resizer.style.left = '0';
    resizer.style.width = '10px';
    resizer.style.height = '10px';
    resizer.style.cursor = 'nw-resize';
    resizer.style.background = 'rgba(0,0,0,0.3)';
    resizer.style.zIndex = '9999';

    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = element.offsetWidth;
      const startHeight = element.offsetHeight;
    
      function onMouseMove(e) {
        const dx = startX - e.clientX;
        const dy = startY - e.clientY;
    
        const newWidth = startWidth + dx;
        const newHeight = startHeight + dy;
    
        if (newWidth >= minWidth) {
          setPickerWidth(newWidth);
        }
    
        if (newHeight > minHeight) {
          setPickerHeight(newHeight);
        }
      }
    
      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
    
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });

    return resizer;
  }

  function init() {
    const observer = new MutationObserver(() => {
      picker = document.querySelector('.emote-picker');
      mainScrollable = document.querySelector('.emote-picker__tab-content');
      navScrollable = document.querySelector('.emote-picker__nav-content-overflow');

      if (picker && mainScrollable && navScrollable) {
        const pickerWidth = window.getComputedStyle(picker).width;
        const pickerHeight = window.getComputedStyle(picker).height;

        const minPopupWidth = parseFloat(pickerWidth);
        const minPopupHeight = parseFloat(pickerHeight);

        const resizer = _createResizer(picker, minPopupWidth, minPopupHeight);

        picker.appendChild(resizer);

        picker.style.overflow = 'hidden';

        console.log('[Extension] Emote picker modified');

        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
