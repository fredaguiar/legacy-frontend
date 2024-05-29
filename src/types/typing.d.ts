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
  lifeCheck?: boolean;
  safes: TSafe[];
};

type TUserUpdate = { fieldToUpdate: 'lifeCheck' | 'all'; lifeCheck?: boolean };

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

type TSignUp = Omit<TUser, 'type' | 'token' | 'emailVerified' | 'mobileVerified'>;
type TCredentials = Pick<TUser, 'email' | 'password'>;

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
