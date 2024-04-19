const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes('image')) return 'image-outline';
  if (fileType.includes('video')) return 'video-outline';
  if (fileType.includes('text')) return 'text-box-outline';
  return 'file-document-outline';
};

const FileTypeUtil = {
  getFileTypeIcon,
};

export { FileTypeUtil };
