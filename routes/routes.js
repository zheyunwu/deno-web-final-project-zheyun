import { Router } from '../deps.js';

import { showLogin, handleLogin, showRegister, handleRegister, handleLogout } from "./controllers/authController.js";
import { index, showReporting, handlePostReportMorning, handlePostReportEvening, showSelfSummary, handleSelectWeekOrMonth } from "./controllers/mainController.js";
import { getLast7DaysSummary, getSummaryByGivenDay } from "./apis/reportApi.js";

const router = new Router();

// controllers
router.get('/auth/login', showLogin);
router.post('/auth/login', handleLogin);
router.post('/auth/logout', handleLogout);
router.get('/auth/register', showRegister);
router.post('/auth/register', handleRegister);

router.get('/', index);
router.get('/behavior/reporting', showReporting);
router.post('/behavior/reporting/morning', handlePostReportMorning);
router.post('/behavior/reporting/evening', handlePostReportEvening);

router.get('/behavior/summary', showSelfSummary);
router.post('/behavior/summary', handleSelectWeekOrMonth);

// apis
router.get('/api/summary', getLast7DaysSummary);
router.get('/api/summary/:year/:month/:day', getSummaryByGivenDay);


export { router };
