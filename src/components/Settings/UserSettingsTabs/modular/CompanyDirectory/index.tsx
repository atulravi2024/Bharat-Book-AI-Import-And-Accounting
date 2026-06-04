import React from 'react';
import { useCompanyDirectory } from './hooks/useCompanyDirectory';
import { DirectorySidebarView } from './views/DirectorySidebarView';
import { UserDetailsView } from './views/UserDetailsView';
import { UserFormModal } from './views/UserFormModal';
import { PasswordResetModal } from './views/PasswordResetModal';

export const CompanyDirectory: React.FC = () => {
  const {
    t,
    filteredUsers,
    selectedUserId,
    setSelectedUserId,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    showExportMenu,
    setShowExportMenu,
    showImportMenu,
    setShowImportMenu,
    fileInputRef,
    exportDropdownRef,
    importDropdownRef,
    isFormOpen,
    setIsFormOpen,
    editingUser,
    formName,
    setFormName,
    formEmail,
    setFormEmail,
    formPhone,
    setFormPhone,
    formRole,
    setFormRole,
    formDept,
    setFormDept,
    formStatus,
    setFormStatus,
    formDob,
    setFormDob,
    formGender,
    setFormGender,
    formAadhaar,
    setFormAadhaar,
    formVoterId,
    setFormVoterId,
    formPan,
    setFormPan,
    formDl,
    setFormDl,
    formProfilePhoto,
    setFormProfilePhoto,
    formLinkedStaffId,
    setFormLinkedStaffId,
    formInactivityTimeoutMinutes,
    setFormInactivityTimeoutMinutes,
    formMaxLoginAttempts,
    setFormMaxLoginAttempts,
    staffMasters,
    isResetPasswordOpen,
    setIsResetPasswordOpen,
    resetTargetUser,
    resetRole,
    setResetRole,
    resetDept,
    setResetDept,
    resetMethod,
    setResetMethod,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    requirePasswordChange,
    setRequirePasswordChange,
    generateSecurePassword,
    handleTogglePermission,
    handleToggleStatus,
    handleDeleteUser,
    handleResetPassword,
    executePasswordReset,
    handleOpenForm,
    handleSaveFormUser,
    handleExport,
    handleImportClick,
    handleFileUpload,
    handleResendInvite,
    getInitials,
    selectedUser,
    loggedInUser,
  } = useCompanyDirectory();

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.json"
        className="hidden"
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px] items-start">
        <DirectorySidebarView
          t={t}
          filteredUsers={filteredUsers}
          selectedUserId={selectedUserId}
          setSelectedUserId={setSelectedUserId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showImportMenu={showImportMenu}
          setShowImportMenu={setShowImportMenu}
          showExportMenu={showExportMenu}
          setShowExportMenu={setShowExportMenu}
          handleImportClick={handleImportClick}
          handleExport={handleExport}
          handleOpenForm={handleOpenForm}
          handleResendInvite={handleResendInvite}
          handleToggleStatus={handleToggleStatus}
          handleResetPassword={handleResetPassword}
          handleDeleteUser={handleDeleteUser}
          getInitials={getInitials}
          loggedInUser={loggedInUser}
          importDropdownRef={importDropdownRef}
          exportDropdownRef={exportDropdownRef}
        />

        <UserDetailsView
          t={t}
          selectedUser={selectedUser}
          getInitials={getInitials}
          handleTogglePermission={handleTogglePermission}
          getRoleLevel={() => 0} // Inherited check within canModifyTarget logic
        />
      </div>

      {isFormOpen && (
        <UserFormModal
          t={t}
          editingUser={editingUser}
          setIsFormOpen={setIsFormOpen}
          handleSaveFormUser={handleSaveFormUser}
          formLinkedStaffId={formLinkedStaffId}
          setFormLinkedStaffId={setFormLinkedStaffId}
          staffMasters={staffMasters}
          formName={formName}
          setFormName={setFormName}
          formEmail={formEmail}
          setFormEmail={setFormEmail}
          formPhone={formPhone}
          setFormPhone={setFormPhone}
          formGender={formGender}
          setFormGender={setFormGender}
          formDob={formDob}
          setFormDob={setFormDob}
          formAadhaar={formAadhaar}
          setFormAadhaar={setFormAadhaar}
          formVoterId={formVoterId}
          setFormVoterId={setFormVoterId}
          formPan={formPan}
          setFormPan={setFormPan}
          formDl={formDl}
          setFormDl={setFormDl}
          formRole={formRole}
          setFormRole={setFormRole}
          formDept={formDept}
          setFormDept={setFormDept}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          formInactivityTimeoutMinutes={formInactivityTimeoutMinutes}
          setFormInactivityTimeoutMinutes={setFormInactivityTimeoutMinutes}
          formMaxLoginAttempts={formMaxLoginAttempts}
          setFormMaxLoginAttempts={setFormMaxLoginAttempts}
          loggedInUser={loggedInUser}
          formProfilePhoto={formProfilePhoto}
          setFormProfilePhoto={setFormProfilePhoto}
        />
      )}

      {isResetPasswordOpen && (
        <PasswordResetModal
          t={t}
          isResetPasswordOpen={isResetPasswordOpen}
          setIsResetPasswordOpen={setIsResetPasswordOpen}
          resetTargetUser={resetTargetUser}
          resetRole={resetRole}
          setResetRole={setResetRole}
          resetDept={resetDept}
          setResetDept={setResetDept}
          resetMethod={resetMethod}
          setResetMethod={setResetMethod}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          passwordError={passwordError}
          requirePasswordChange={requirePasswordChange}
          setRequirePasswordChange={setRequirePasswordChange}
          generateSecurePassword={generateSecurePassword}
          executePasswordReset={executePasswordReset}
        />
      )}
    </>
  );
};

export default CompanyDirectory;
