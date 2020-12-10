import { executeQuery } from "../database/database.js"

const getAvgMood = async(date) => {
  const response = await executeQuery("SELECT AVG(mood) FROM reports WHERE date = $1", date);
  return response;
}

const getReportByDate = async(date, time, uid) => {
  const response = await executeQuery("SELECT * FROM reports WHERE date = $1 AND time = $2 AND user_id = $3", date, time, uid);
  return response;
}

const postReport = async(data) => {
  if (data.time === 'morning') {
    await executeQuery("INSERT INTO reports (date, time, sleep_duration, sleep_quality, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6)", data.date, data.time, data.sleep_duration, data.sleep_quality, data.mood, data.user_id);
  }
  if (data.time === 'evening') {
    await executeQuery("INSERT INTO reports (date, time, time_on_sports, time_on_study, regularity_quality_eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)", data.date, data.time, data.time_on_sports, data.time_on_study, data.regularity_quality_eating, data.mood, data.user_id);
  }
}

const getSummaryByWeek = async(uid, year=null, week=null) => {
  let response;

  response = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date_part('year', date::date) = $2 AND date_part('week', date::date) = $3", uid, year, week);
  if (response.rowCount === 0) return null;

  response = await executeQuery("SELECT AVG(sleep_duration) AS avg_sleep_duration, AVG(time_on_sports) AS avg_time_on_sports, AVG(time_on_study) AS avg_time_on_study, AVG(sleep_quality) AS avg_sleep_quality, AVG(mood) AS avg_mood FROM reports WHERE user_id = $1 AND date_part('year', date::date) = $2 AND date_part('week', date::date) = $3", uid, year, week);
  return response.rowsOfObjects()[0];
}

const getSummaryByMonth = async(uid, year=null, month=null) => {
  let response;
  response = await executeQuery("SELECT * FROM reports WHERE user_id = $1 AND date_part('year', date::date) = $2 AND date_part('month', date::date) = $3", uid, year, month);
  if (response.rowCount === 0) return null;
  
  response = await executeQuery("SELECT AVG(sleep_duration) AS avg_sleep_duration, AVG(time_on_sports) AS avg_time_on_sports, AVG(time_on_study) AS avg_time_on_study, AVG(sleep_quality) AS avg_sleep_quality, AVG(mood) AS avg_mood FROM reports WHERE user_id = $1 AND date_part('year', date::date) = $2 AND date_part('month', date::date) = $3", uid, year, month);
  return response.rowsOfObjects()[0];
}

const getLast7DaysSummary = async() => {
  let date = new Date();
  date.setDate(date.getDate()-7);

  const response = await executeQuery("SELECT AVG(sleep_duration) AS avg_sleep_duration, AVG(time_on_sports) AS avg_time_on_sports, AVG(time_on_study) AS avg_time_on_study, AVG(sleep_quality) AS avg_sleep_quality, AVG(mood) AS avg_mood FROM reports WHERE date > $1", date.toISOString().split('T')[0]);
  return response ? response.rowsOfObjects()[0] : {}
}

const getSummaryByGivenDay = async(year, month, day) => {

  const response = await executeQuery("SELECT AVG(sleep_duration) AS avg_sleep_duration, AVG(time_on_sports) AS avg_time_on_sports, AVG(time_on_study) AS avg_time_on_study, AVG(sleep_quality) AS avg_sleep_quality, AVG(mood) AS avg_mood FROM reports WHERE date_part('year', date::date) = $1 AND date_part('month', date::date) = $2 AND date_part('day', date::date) = $3", year, month, day);
  return response ? response.rowsOfObjects()[0] : {}
}


export { getAvgMood, getReportByDate, postReport, getSummaryByWeek, getSummaryByMonth, getLast7DaysSummary, getSummaryByGivenDay };