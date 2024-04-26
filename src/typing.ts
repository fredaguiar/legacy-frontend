export type TFileType = 'photo' | 'video' | 'audio' | 'text' | 'file' | 'password';
export type TFileTypeValues = { label: string; iconName: string };
export const TFileTypeMap: Record<TFileType, TFileTypeValues> = {
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

export type TSafe = {
  name: string;
  _id: string;
};

export type TUser = {
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

export type TUploadFiles = {
  name: string;
  type: string;
  uri: string;
  safeId: string;
};

export type TUploadFilesResult = {
  url: string;
  name: string;
  type: string;
};

export type TDownloadFiles = {
  safeId: string;
  fileId: string;
};

export type TDownloadFilesResult = {
  name: string;
};

export type TFileInfo = {
  id: string;
  filename: string;
  length: number;
  uploadDate: Date;
  mimetype: string;
};

export type TFileInfoList = {
  safeId: string;
};

export type TFileInfoListResult = {
  fileInfoList: Array<TFileInfo>;
};

export type TSignUp = Omit<TUser, 'type' | 'token' | 'emailVerified' | 'mobileVerified'>;
export type TCredentials = Pick<TUser, 'email' | 'password'>;
