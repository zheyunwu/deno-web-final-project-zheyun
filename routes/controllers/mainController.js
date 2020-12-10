import * as reportService from "../../services/reportService.js";

const index = async({request, response, session, render}) => {
  let date = new Date();
  const today = date.toISOString().split('T')[0];
  date.setDate(date.getDate() - 1);
  const yesterday = date.toISOString().split('T')[0];

  const today_mood = await reportService.getAvgMood(today);
  const yesterday_mood = await reportService.getAvgMood(yesterday);

  const data = {
    today_mood: today_mood.rowsOfObjects()[0].avg || 0,
    yesterday_mood: yesterday_mood.rowsOfObjects()[0].avg || 0,
    loggedin: await session.get('loggedin') || false,
    user: await session.get('user') || null
  }  

  render('index.ejs', data)
}

const showReporting = async({session, render}) => {
  render('behavior/reporting.ejs', { msg: null, error: null, loggedin: await session.get('loggedin') || false, user: await session.get('user') || null })
}

const handlePostReportMorning = async({request, response, session, render}) => {
  const form = await request.body().value;

  const date = form.get('date');
  const sleep_duration = form.get('sleep_duration');
  const sleep_quality = form.get('sleep_quality');
  const mood = form.get('mood');

  const user = await session.get('user');
  const data = {
    date: date,
    time: 'morning',
    sleep_duration: sleep_duration,
    sleep_quality: sleep_quality,
    mood: mood,
    user_id: user.id
  }

  const existing = await reportService.getReportByDate(data.date, data.time, user.id);
  if (existing && existing.rowCount > 0) {
    render('behavior/reporting.ejs', { msg: null, error: 'Duplicated date', loggedin: await session.get('loggedin') || false, user: await session.get('user') || null })
    return;
  }

  await reportService.postReport(data);
  render('behavior/reporting.ejs', { msg: 'Submit success!', error: null, loggedin: await session.get('loggedin') || false, user: await session.get('user') || null })
}

const handlePostReportEvening = async({request, response, session, render}) => {
  const form = await request.body().value;

  const date = form.get('date');
  const time_on_sports = form.get('time_on_sports');
  const time_on_study = form.get('time_on_study');
  const regularity_quality_eating = form.get('regularity_quality_eating');
  const mood = form.get('mood');

  const user = await session.get('user');
  const data = {
    date: date,
    time: 'evening',
    time_on_sports: time_on_sports,
    time_on_study: time_on_study,
    regularity_quality_eating: regularity_quality_eating,
    mood: mood,
    user_id: user.id
  }

  const existing = await reportService.getReportByDate(data.date, data.time, user.id);
  if (existing && existing.rowCount > 0) {
    render('behavior/reporting.ejs', { msg: null, error: 'Duplicated date', loggedin: await session.get('loggedin') || false, user: await session.get('user') || null })
    return;
  }

  await reportService.postReport(data);
  render('behavior/reporting.ejs', { msg: 'Submit success!', error: null, loggedin: await session.get('loggedin') || false, user: await session.get('user') || null })
}

const showSelfSummary = async({request, session, render}) => {
  const user = await session.get('user');

  // handle date
  Date.prototype.getWeek = function() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  }
  const date = new Date();
  let year = date.getFullYear();
  let week = date.getWeek() - 1;
  let month = date.getMonth();
  console.log(month)

  let week_summary = await reportService.getSummaryByWeek(user.id, year, week);
  let month_summary = await reportService.getSummaryByMonth(user.id, year, month);

  // if (request.method === 'POST') {
  //   const form = await request.body().value;
  //   // if (form.get('type') === 'week') {
  //     console.log(form.get('week'));
  //     year1 = form.get('week').split('-W')[0];
  //     week = form.get('week').split('-W')[1];
  //     week_summary = await reportService.getSummaryByWeek(user.id, year1, week);
  //   // }

  //   // if (form.get('type') === 'month') {
  //     console.log(form.get('month'));
  //     year2 = form.get('month').split('-')[0];
  //     month = form.get('month').split('-')[1];
  //     month_summary = await reportService.getSummaryByMonth(user.id, year2, month);
  //   // }
  // }

  const data = {
    loggedin: true,
    user: user,
    week: `${year}-W${week}`,
    month: `${year}-${month}`,
    week_summary: week_summary,
    month_summary: month_summary
  }
  render('behavior/summary.ejs', data)
}

const handleSelectWeekOrMonth = async({request, session, render}) => {
  const user = await session.get('user');

  const form = await request.body().value;
  // if (form.get('type') === 'week') {
    console.log(form.get('week'));
    const year1 = form.get('week').split('-W')[0];
    const week = form.get('week').split('-W')[1];
    const week_summary = await reportService.getSummaryByWeek(user.id, year1, week);
  // }

  // if (form.get('type') === 'month') {
    console.log(form.get('month'));
    const year2 = form.get('month').split('-')[0];
    const month = form.get('month').split('-')[1];
    const month_summary = await reportService.getSummaryByMonth(user.id, year2, month);
  // }

  const data = {
    loggedin: true,
    user: user,
    week: `${year1}-W${week}`,
    month: `${year2}-${month}`,
    week_summary: week_summary,
    month_summary: month_summary
  }
  render('behavior/summary.ejs', data)
}

export { index, showReporting, handlePostReportMorning, handlePostReportEvening, showSelfSummary, handleSelectWeekOrMonth };