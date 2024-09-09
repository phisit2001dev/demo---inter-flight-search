export interface FileData {
  fileId?: string;
  fileTypeId?: string;
  fileTypeCode?: string;
  fileName?: string;
  fileNameSys?: string;
  fileSize?: number;
  filePath?: string;
  active?: string;
  editFlag?: string;
  blobFileEdit?: Blob;
  fileExist?: boolean;
}

export interface UpLoadFileData {
  jsonReq: string;
  // fileAtt:
}
