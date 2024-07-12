(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global =
        typeof globalThis === 'undefined' ? global || self : globalThis),
      (global.yearDropdownPlugin = factory()));
})(this, function () {
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  let __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (const p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return Reflect.apply(__assign, this, arguments);
  };

  const defaultConfig = {
    selectYear: new Date().getFullYear(),
  };
  function yearDropdownPlugin(pluginConfig) {
    const config = { ...defaultConfig, ...pluginConfig };
    let initialYear = config.selectYear;
    return function (fp) {
      const self = {
        yearSelectContainer: null,
        yearSelect: null,
      };
      const hideOldYearInput = function () {
        const flatpickrYearElement = fp.currentYearElement;
        flatpickrYearElement.parentElement.classList.add('flatpickr-disabled');
      };
      const setDefaultMinMaxDate = function () {
        // set min date to last day of current year - 150
        if (!fp.config.minDate) {
          fp.config.minDate = new Date(new Date().getFullYear() - 150, 0, 1);
        }
        // set max date to last day of current year
        if (!fp.config.maxDate) {
          fp.config.maxDate = new Date(new Date().getFullYear(), 11, 31);
        }
      };
      const createSelectElement = function (initialYear) {
        let start = fp.config.minDate.getFullYear();
        let end = fp.config.maxDate.getFullYear();
        self.yearSelect = fp._createElement(
          'select',
          'flatpickr-monthDropdown-months'
        );
        self.yearSelect.setAttribute('aria-label', 'year selection');
        if (fp.config.useLocaleYear) {
          start += fp.l10n.localeYearAdjustment;
          end += fp.l10n.localeYearAdjustment;
          initialYear += fp.l10n.localeYearAdjustment;
        }
        for (let i = end; i >= start; i--) {
          const year = fp._createElement(
            'option',
            'flatpickr-monthDropdown-month'
          );
          year.value = i.toString();
          year.text = i.toString();
          self.yearSelect.append(year);
        }
        self.yearSelect.value =
          initialYear > end ? end.toString() : initialYear.toString();
      };
      const createSelectContainer = function () {
        self.yearSelectContainer = fp._createElement('div', 'numInputWrapper');
        self.yearSelectContainer.tabIndex = -1;
        if (self.yearSelect) {
          self.yearSelectContainer.append(self.yearSelect);
        }
      };
      const buildSelect = function () {
        initialYear = fp.latestSelectedDateObj
          ? fp.latestSelectedDateObj.getFullYear()
          : initialYear;
        createSelectElement(initialYear);
        createSelectContainer();
        fp.yearSelect = self.yearSelect;
        fp.yearSelectContainer = self.yearSelectContainer;
      };
      const bindEvents = function () {
        if (self.yearSelect !== null) {
          fp._bind(self.yearSelect, 'change', onYearSelected);
          fp._bind(self.yearSelect, 'reset', onReset);
        }
      };
      const changeYear = function () {
        const { yearSelect } = fp;
        let year = fp.currentYear;
        if (fp.config.useLocaleYear) {
          year += fp.l10n.localeYearAdjustment;
        }
        yearSelect.value = year.toString();
      };
      // Events
      var onYearSelected = function (e) {
        let year;
        const { target } = e;
        const selectedYear = target.value;
        fp.currentYearElement.value = selectedYear;
        if (fp.config.useLocaleYear) {
          year = Number.parseInt(selectedYear) - fp.l10n.localeYearAdjustment;
          fp.currentYear = year;
        } else {
          year = Number.parseInt(selectedYear);
          fp.currentYear = year;
        }
        fp.changeYear(+year);
        fp.redraw();
      };
      var onReset = function () {
        self.yearSelect.value = fp.currentYearElement.value;
        fp.redraw();
      };
      function destroyPluginInstance() {
        if (self.yearSelect !== null) {
          self.yearSelect.removeEventListener('change', onYearSelected);
        }
      }
      return {
        onReady: [
          setDefaultMinMaxDate,
          hideOldYearInput,
          buildSelect,
          bindEvents,
          function () {
            const flatpickrYearElement = fp.currentYearElement;
            flatpickrYearElement.parentElement.parentElement.append(
              fp.yearSelectContainer
            );
          },
        ],
        onYearChange: changeYear,
        onChange: changeYear,
        onDestroy: [destroyPluginInstance],
      };
    };
  }

  return yearDropdownPlugin;
});
