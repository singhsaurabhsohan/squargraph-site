# Careers Operations

## Ownership

The founder owns role approval, commercial terms, workplace policy and final hiring decisions. The website maintainer owns role publishing, form health and metadata. Applicant data must be reviewed only by people involved in hiring.

## Application Review Workflow

1. Review new records in `careers_applications` and move relevant applications from `New` to `Reviewing`.
2. Assess capability, judgment, experience and role fit. Do not use sensitive demographic information.
3. Use `Shortlisted`, `Interview` or `Hold` only when there is a clear operational reason.
4. Record the final outcome as `Rejected` or `Hired`.
5. Never expose internal status values publicly.

## Role Publishing Checklist

- Confirm that the role is genuinely approved and funded.
- State discipline, location, working model, engagement type and experience clearly.
- State the compensation or commercial model on a role detail page before adding `JobPosting` schema.
- Confirm that summary, apply URL, dates and status are accurate.
- Add the role to `assets/data/careers.json` with `published: true`.
- Run `node tools/render-careers.mjs`.
- Verify desktop and mobile layouts, links, analytics and the application path.

## Pausing or Closing a Role

- Use `paused` when applications are temporarily not being accepted.
- Use `closed` when the opportunity is no longer active.
- Closed roles do not render by default.
- Run `node tools/render-careers.mjs` after every status change.
- Remove any role-specific `JobPosting` schema when the role closes.

## Applicant Privacy

- Keep the `careers-cvs` bucket private.
- Do not share signed CV links outside the hiring review group.
- Never place applicant names, email addresses, phone numbers, CV filenames, links or introductions in analytics.
- Do not request Aadhaar, PAN, banking details, religion, caste, marital status, political affiliation or unnecessary salary history.
- Recommended retention is 12 months for unsuccessful or speculative applications, followed by deletion unless the applicant has agreed to longer consideration or a legal requirement applies.
- Review the retention recommendation with legal counsel before treating it as a formal policy.

## Candidate Communication Templates

### Shortlisted

Thank you for introducing yourself to SQUARGRAPH. Your experience appears relevant to the opportunity, and we would like to arrange a practical conversation about the work, expectations and operating model.

### Hold

Thank you for sharing your work. There is no immediate fit we can confirm today, but we would like to retain your profile for a future relevant opportunity in line with the consent provided.

### Not selected

Thank you for the time and context you shared. We are not progressing the application for this opportunity. We appreciate your interest in SQUARGRAPH and wish you well with what you build next.

## Review Cadence

- Review new applications at least weekly while a role is open.
- Review speculative profiles monthly.
- Audit published roles and workplace policy monthly.
- Audit access to applicant data and private storage quarterly.
- Remove outdated roles immediately rather than leaving stale vacancies live.
