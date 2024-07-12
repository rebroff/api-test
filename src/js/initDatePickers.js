import flatpickr from 'flatpickr_plus/dist/flatpickr';
// import flatpickr2 from 'flatpickr/dist/flatpickr';
import { Russian } from 'flatpickr_plus/dist/l10n/ru';
import confirmDatePlugin from 'flatpickr_plus/dist/plugins/confirmDate/confirmDate';
import yearDropdownPlugin from 'flatpickr_plus/dist/plugins/yearDropdown';

const mNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const minDate = new Date().setFullYear(new Date().getFullYear() - 10);
const maxDate = new Date();

// function setModeAttr(instance) {
//   instance.calendarContainer.dataset.mode = instance.config.mode;
// }

function switchMode(instance, newMode) {
  instance.set('mode', newMode);
  //
  // setModeAttr(instance);
}

function setQuickSelectRange(instance, range) {
  let startDate;
  let mode;
  const endDate =
    instance.selectedDates.length > 0 ? instance.selectedDates[0] : new Date();
  const tempEndDate = new Date(endDate.getTime());

  switch (range) {
    case 'yesterday': {
      startDate = new Date(tempEndDate.setDate(tempEndDate.getDate() - 1));
      mode = 'single';
      break;
    }
    case 'beforeYesterday': {
      startDate = new Date(tempEndDate.setDate(tempEndDate.getDate() - 2));
      mode = 'single';
      break;
    }
    case 'week': {
      startDate = new Date(tempEndDate.setDate(tempEndDate.getDate() - 7));
      mode = 'range';
      break;
    }
    case 'month': {
      startDate = new Date(tempEndDate.setMonth(tempEndDate.getMonth() - 1));
      mode = 'range';
      break;
    }
    case 'quarter': {
      startDate = new Date(tempEndDate.setMonth(tempEndDate.getMonth() - 3));
      mode = 'range';
      break;
    }
    case 'year': {
      startDate = new Date(
        tempEndDate.setFullYear(tempEndDate.getFullYear() - 1)
      );
      mode = 'range';
      break;
    }
    default: {
      mode = 'single';
    }
  }

  const newDates = mode === 'single' ? endDate : [startDate, endDate];

  instance.setDate(
    [
      startDate,
      new Date(
        `${endDate.getFullYear()}-${
          endDate.getMonth() + 1
        }-${endDate.getDate()}`
      ),
    ],
    true
  );
}

export function initDatePickers() {
  const datepikers = document.querySelectorAll('.datepicker');

  // flatpickr2(document.querySelector('.datepicker2'), {
  //   // locale: Russian,
  //   // allowInput: true,
  //   // dateFormat: 'd.m.Y',
  //   // defaultDate: new Date(),
  //   // mode: 'range',
  //   // enableTime: true,
  //   // minDate,
  //   // maxDate: new Date(),
  //   // onDayCreate(dObj, dStr, fp, dayElem) {
  //   //   console.log(dObj, dStr, fp, dayElem);
  //   //   // dayElem.innerHTML = `<span>${dStr}</span>`;
  //   // },
  // });

  datepikers.forEach((datepiker) => {
    flatpickr(datepiker, {
      locale: Russian,
      allowInput: true,
      dateFormat: 'd.m.Y',
      // defaultDate: new Date(),
      mode: 'range',
      enableTime: true,
      // minDate,
      maxDate: new Date(),
      plugins: [
        new confirmDatePlugin({
          confirmIcon: '',
          confirmText: 'Применить',
          showAlways: true,
        }),
        new yearDropdownPlugin(),
      ],
      // onDayCreate(dObj, dStr, fp, dayElem) {
      //   console.log(dObj, dStr, fp, dayElem);
      //   dayElem.innerHTML = `<span>${dStr}</span>`;
      // },
      onValueUpdate(selectedDates, dateStr, instance) {
        if (!instance.isConfirmed && !instance.isOpen) {
          instance.setDate();
        }
      },
      onReady(selectedDates, dateStr, instance) {
        console.log(instance);

        instance.isConfirmed = false;

        // instance.daysContainer.addEventListener('mouseenter', () => {
        //   instance.daysContainer.classList.add('_hover');
        // });
        //
        // instance.daysContainer.addEventListener('mouseleave', () => {
        //   instance.daysContainer.classList.remove('_hover');
        //
        //   // Если выбор диапазона не зафиксирован, то снимаем его выделение
        //   const daysElements = [
        //     ...instance.daysContainer.querySelectorAll('.flatpickr-day'),
        //   ];
        //   const selectedDaysElements = daysElements.filter((el) =>
        //     el.classList.contains('selected')
        //   );
        //
        //   if (selectedDaysElements.length < 2) {
        //     daysElements
        //       .filter((el) => !el.classList.contains('selected'))
        //       .forEach((el) => {
        //         el.classList.remove('inRange', 'endRange');
        //       });
        //   }
        // });

        const mSelect = instance.monthsDropdownContainer;
        const ySelect = instance.yearSelect;
        const topWrapper = instance.monthNav;
        const selectWrapper = instance.calendarContainer.querySelector(
          '.flatpickr-current-month'
        );
        const { innerContainer, calendarContainer } = instance;

        // setModeAttr(instance);

        // Добавляем кнопки быстрого выбора
        innerContainer.insertAdjacentHTML(
          'afterbegin',
          `
            <div class="quick-selection">
                <button type="button" data-range="week" class="dp-quick-selection-btn dp-quick-selection-btn--range">Неделя</button>
                <button type="button" data-range="quarter" class="dp-quick-selection-btn dp-quick-selection-btn--range">Квартал</button>
                <button type="button" data-range="month" class="dp-quick-selection-btn dp-quick-selection-btn--range">Месяц</button>
                <button type="button" data-range="year" class="dp-quick-selection-btn dp-quick-selection-btn--range">Год</button>
                <button type="button" data-range="yesterday" class="dp-quick-selection-btn dp-quick-selection-btn--single">Вчера</button>
                <button type="button" data-range="today" class="dp-quick-selection-btn dp-quick-selection-btn--single">Сегодня</button>
                <button type="button" data-range="beforeYesterday" class="dp-quick-selection-btn dp-quick-selection-btn--single">Позавчера</button>
            </div>`
        );

        // Добавляем дропдауны месяца и года
        const monthBtns = [...mSelect.querySelectorAll('option')].map(
          (option) => {
            return `<button type="button" class="dp-dropdown-btn dp-dropdown-btn--month" data-value="${option.value}">${option.textContent}</button>`;
          }
        );
        const yearBtns = [...ySelect.querySelectorAll('option')].map(
          (option) => {
            return `<button type="button" class="dp-dropdown-btn dp-dropdown-btn--year" data-value="${option.value}">${option.textContent}</button>`;
          }
        );

        selectWrapper.insertAdjacentHTML(
          'afterbegin',
          `<button type="button" class="dp-year-dropdown-toggle">${+ySelect.value}</button>`
        );

        selectWrapper.insertAdjacentHTML(
          'afterbegin',
          `<button type="button" class="dp-month-dropdown-toggle">
            ${mNames[+mSelect.value]}
            </button>`
        );

        innerContainer.insertAdjacentHTML(
          'beforeend',
          `
            <div class="dp-month-dropdown-content">
                ${monthBtns.join('')}
            </div>
            <div class="dp-year-dropdown-content">
                ${yearBtns.join('')}
            </div>`
        );

        const mDropdownContent = innerContainer.querySelector(
          '.dp-month-dropdown-content'
        );

        const yDropdownContent = innerContainer.querySelector(
          '.dp-year-dropdown-content'
        );

        const mDropdowmToggle = topWrapper.querySelector(
          '.dp-month-dropdown-toggle'
        );

        const yDropdowmToggle = topWrapper.querySelector(
          '.dp-year-dropdown-toggle'
        );

        mDropdowmToggle.addEventListener('click', () => {
          yDropdownContent.classList.remove('_opened');
          mDropdownContent.classList.toggle('_opened');
        });

        yDropdowmToggle.addEventListener('click', () => {
          mDropdownContent.classList.remove('_opened');
          yDropdownContent.classList.toggle('_opened');
        });

        mSelect.addEventListener('change', () => {
          mDropdowmToggle.textContent = mNames[+mSelect.value];
        });

        ySelect.addEventListener('change', () => {
          yDropdowmToggle.textContent = ySelect.value;
        });

        calendarContainer.addEventListener('click', (e) => {
          const { target } = e;

          if (target.classList.contains('dp-dropdown-btn--month')) {
            mSelect.value = target.dataset.value;
            mSelect.dispatchEvent(new Event('change'));
            mDropdowmToggle.textContent = mNames[+mSelect.value];
            target.parentNode.classList.remove('_opened');
          }

          if (target.classList.contains('dp-dropdown-btn--year')) {
            ySelect.value = target.dataset.value;
            ySelect.dispatchEvent(new Event('change'));
            yDropdowmToggle.textContent = ySelect.value;
            target.parentNode.classList.remove('_opened');
          }

          if (target.dataset?.range) {
            setQuickSelectRange(instance, target.dataset?.range);
          }

          // if (target.classList.contains('flatpickr-day.selected')) {
          //   if(target.classList.contains('endRange')) {
          //     instance.setDate(instance.selectedDates[0])
          //   } else {
          //     instance.setDate(instance.selectedDates.slice(-1))
          //   }
          //   return false;
          // }
        });
      },
      onChange(selectedDates, dateStr, instance) {
        const mSelect = instance.monthsDropdownContainer;
        const ySelect = instance.yearSelect;

        mSelect.dispatchEvent(new Event('change', { bubbles: true }));
        ySelect.dispatchEvent(new Event('change', { bubbles: true }));

        if (
          (selectedDates.length > 1 && instance.config.mode === 'range') ||
          (selectedDates.length > 0 && instance.config.mode === 'single')
        ) {
          instance.calendarContainer.classList.add('_has-selected');
        } else {
          instance.calendarContainer.classList.remove('_has-selected');
        }
      },
    });
  });
}
