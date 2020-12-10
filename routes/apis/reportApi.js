import * as reportService from "../../services/reportService.js";

const getLast7DaysSummary = async({response}) => {
  response.body = await reportService.getLast7DaysSummary();
};

const getSummaryByGivenDay = async({params, response}) => {
  response.body = await reportService.getSummaryByGivenDay(params.year, params.month, params. day);
};

export { getLast7DaysSummary, getSummaryByGivenDay };