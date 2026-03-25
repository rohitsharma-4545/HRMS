export function buildSelfProfile(profile: any) {
  return profile;
}

export function buildPublicEmployeeProfile(profile: any) {
  return {
    id: profile.id,
    employeeCode: profile.employeeCode,

    personalProfile: {
      salutation: profile.personalProfile?.salutation,
      firstName: profile.personalProfile?.firstName,
      middleName: profile.personalProfile?.middleName,
      lastName: profile.personalProfile?.lastName,
      preferredName: profile.personalProfile?.preferredName,
      about: profile.personalProfile?.about,
    },
    addresses: profile.addresses,
    contacts: profile.contacts,

    workProfile: profile.workProfile,
    reportingOffice: profile.reportingOffice,
    experiences: profile.experiences,
    department: profile.department,
    firstName: profile.firstName,
    lastName: profile.lastName,
    designation: profile.designation,
    user: profile.user,

    bankDetails: undefined,
    documents: undefined,
  };
}
