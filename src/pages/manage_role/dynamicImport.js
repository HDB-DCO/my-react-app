import React from 'react';


const dynamicImport = (path) => {
  switch (path) {
    case '/':
      return React.lazy(() => import('../Login'));
    case '/vendor_home':
      return React.lazy(() => import('../VendorHome'));
    case '/pl_home':
      return React.lazy(() => import('../PLHome'));
    case '/cp_home':
      return React.lazy(() => import('../CPHome'));
    case '/admin_home':
      return React.lazy(() => import('../AdminHome'));
    case '/add_user':
      return React.lazy(() => import('../AddUser'));
    case '/absence_request':
      return React.lazy(() => import('../AbsenceRequestCopy'));
    case '/file_upload_recent':
      return React.lazy(() => import('../FileUploadRecent'));
    case '/application_status':
      return React.lazy(() => import('../ApplicationStatus'));
    case '/approval_request':
      return React.lazy(() => import('../ApprovalRequest'));
    case '/approved_requests':
      return React.lazy(() => import('../ApprovedRequests'));
    // Add more paths as needed
    default:
      return React.lazy(() => import('../NoPage'));
  }
};

export default dynamicImport;
