type TUploadFiles = {
  name: string;
  type: string;
  uri: string;
  safeId: string;
  fileId?: string;
};

type TFileType = 'photo' | 'video' | 'audio' | 'text' | 'file' | 'password';
type TFileTypeValues = { label: string; iconName: string };

type TSafe = {
  _id?: string;
  name?: string;
  description?: string;
  autoSharing?: boolean;
  emails?: TContactInfo[];
  phones?: TContactInfo[];
};

type TSafeUpdate = TSafe & {
  fieldToUpdate: 'name' | 'description' | 'autoSharing';
};

type TSafeIdList = {
  safeIdList: Array<string>;
};

type TGetSafe = {
  safeId: string;
};

type TUser = {
  firstName: string;
  lastName: string;
  language: string;
  country: string;
  email: string;
  phoneCountry: string;
  phone: string;
  password?: string;
  token: string;
  type: 'auth' | 'google';
  emailVerified: boolean;
  mobileVerified: boolean;
  introductionViewed?: boolean;
  storageQuotaInMB?: number;
  lifeCheck: {
    active?: boolean;
    shareTime?: date;
    shareWeekday?: string;
    shareCount?: number;
    shareCountType?: string;
    shareCountNotAnswered?: number;
  };
  safes: TSafe[];
};

type TUserProfile = Omit<TUser, 'password' | 'token' | 'safes'>;

type TSignUp = Omit<TUser, 'type' | 'token' | 'emailVerified' | 'mobileVerified'>;

type TCredentials = Pick<TUser, 'email' | 'password'>;

type TUserUpdate = {
  firstName?: string;
  lastName?: string;
  language?: string;
  country?: string;
  email?: string;
  phoneCountry?: string;
  phone?: string;
  type?: 'auth' | 'google';
  emailVerified?: boolean;
  mobileVerified?: boolean;
  introductionViewed?: boolean;
  storageQuotaInMB?: number;
  lifeCheck: {
    active?: boolean;
    shareTime?: date;
    shareWeekday?: string;
    shareCount?: number;
    shareCountType?: string;
    shareCountNotAnswered?: number;
  };
  fieldsToUpdate: TUserFieldsToUpdate[];
};

// type TUserProfileUpdate = Pick<
//   TUser,
//   'firstName' | 'lastName' | 'language' | 'country' | 'email' | 'phoneCountry' | 'phone'
// >;

type TUserLifeCheckUpdate = Pick<TUserUpdate, 'lifeCheck'>;

type TUserFieldsToUpdate =
  | 'firstName'
  | 'lastName'
  | 'language'
  | 'country'
  | 'email'
  | 'phoneCountry'
  | 'phone'
  | 'type: '
  | 'emailVerified'
  | 'mobileVerified'
  | 'introductionViewed'
  | 'storageQuotaInMB'
  | 'lifeCheck.active'
  | 'lifeCheck.shareTime'
  | 'lifeCheck.shareWeekday'
  | 'lifeCheck.shareCount'
  | 'lifeCheck.shareCountType'
  | 'lifeCheck.shareCountNotAnswered';

type TUploadFilesResult = {
  url: string;
  name: string;
  type: string;
};

type TDownloadFiles = {
  safeId: string;
  fileId: string;
  filename: string;
  mimetype: string;
};

type TDownloadFilesResult = {
  name: string;
};

type TFileInfo = {
  id: string;
  filename: string;
  length: number;
  uploadDate: Date;
  mimetype: string;
};

type TFileInfoList = {
  safeId: string;
};

type TFileInfoListResult = {
  fileInfoList: Array<TFileInfo & TPassword>;
};

type TText = {
  title: string;
  text: string;
  fileId?: string;
};

type TTextTitle = {
  fileId: string;
  title: string;
  safeId: string;
};

type TAutoSharing = {
  autoSharing: boolean;
  safeId: string;
};

type TPassword = {
  title: string;
  username: string;
  password: string;
  notes: string;
  safeId: string;
  fileId?: string;
};

type TGetPassword = {
  fileId: string;
  safeId: string;
};

type StorageInfo = {
  storageUsedInBytes: number;
  storageFileCount: number;
  storageQuotaInMB: number;
};

type TContactInfo = {
  _id?: string;
  name?: string;
  contact?: string;
  checked?: boolean;
  type?: TContactInfoType;
};

type TContactUpdate = {
  safeId: string;
  contactList: TContactInfo[];
  deleteContactList: string[];
  contactType: 'emails' | 'phones';
};

type TContactInfoType = 'email' | 'phone';
