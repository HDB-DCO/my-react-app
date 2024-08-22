// rolesConfig.js
const rolesConfig = {
  '/': ['PUBLIC','VENDOR', 'ADMIN', 'CP', 'PL'],
  '/file_upload_recent': ['PUBLIC','VENDOR', 'ADMIN', 'CP', 'PL'],
  '/application_status': ['VENDOR', 'ADMIN', 'CP', 'PL'],
  '/approval_request': ['VENDOR', 'PL'],
  '/approved_requests': ['VENDOR', 'PL'],
  '/vendor_home': ['VENDOR','ADMIN'],
  '/pl_home': ['PL'],
  '/cp_home': ['CP'],
  '/absence_request': ['CP'],
  '/admin_home': ['ADMIN'],
  '/add_user': ['ADMIN'],
  // Add more routes and roles as needed
};

export default rolesConfig;
