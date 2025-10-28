router.post('/', /* requireAuth, */ async (req, res) => {
  try {
    const { value, error } = createBugReportSchema.validate(req.body, { abortEarly:false });
    if (error) return res.status(400).json({ ok:false, errors: error.details.map(d=>d.message) });

    
    const user_id = req.user.user_id ;
    const reporterRole = req.user.role ;

    const saved = await BugReport.create({
      subject: value.subject,
      description: value.description,
      user_id,
      reporterRole,
    });

    return res.status(201).json({ ok:true, id: saved.id });
  } catch (e) {
    console.error('[bugReports POST]', e);
    return res.status(500).json({ ok:false, error:'Failed to submit bug' });
  }
});
