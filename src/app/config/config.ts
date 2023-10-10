import { MenuItem } from "primeng-lts/api";
//export const URL_SERVICIOS = 'http://localhost/api-calidad/public/api/';
//export const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };
//export const URL_ARCHIVO = 'http://localhost/api-calidad/public/';

export const URL_SERVICIOS =
  "https://productosgraziani.com.ar/api-calidad/public/api/";
export const config: SocketIoConfig = {
  url: "https://productosgraziani.com.ar:4444",
  options: {},
};
export const URL_ARCHIVO =
  "https://productosgraziani.com.ar/api-calidad/public/";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

export const PARAMS = "json=";

export const calendarioIdioma: any = {
  closeText: "Done",
  prevText: "Prev",
  nextText: "Next",
  currentText: "Today",
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul1",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday1",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun1", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  dayNamesMin: ["Su1", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  weekHeader: "Wk",
  dateFormat: "dd/mm/yy",
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: "",
};
