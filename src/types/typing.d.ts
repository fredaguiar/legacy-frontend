type TUploadFiles = {
  name: string;
  type: string;
  uri: string;
  safeId: string;
};

type TFileType = 'photo' | 'video' | 'audio' | 'text' | 'file' | 'password';
type TFileTypeValues = { label: string; iconName: string };
const TFileTypeMap: Record<TFileType, TFileTypeValues> = {
  photo: {
    label: 'photo',
    iconName: 'camera',
  },
  video: {
    label: 'video',
    iconName: 'video-box',
  },
  audio: {
    label: 'audio',
    iconName: 'microphone',
  },
  text: {
    label: 'text',
    iconName: 'text-box-outline',
  },
  file: {
    label: 'file',
    iconName: 'file-outline',
  },
  password: {
    label: 'password',
    iconName: 'key-outline',
  },
};

type TSafe = {
  name: string;
  _id: string;
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
  safes: TSafe[];
};

type TUploadFilesResult = {
  url: string;
  name: string;
  type: string;
};

type TDownloadFiles = {
  safeId: string;
  fileId: string;
  filename: string;
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
  fileInfoList: Array<TFileInfo>;
};

type TSignUp = Omit<TUser, 'type' | 'token' | 'emailVerified' | 'mobileVerified'>;
type TCredentials = Pick<TUser, 'email' | 'password'>;