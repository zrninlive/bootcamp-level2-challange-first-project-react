import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    try {
      const [csvFile] = uploadedFiles;
      data.append('file', csvFile.file, csvFile.name);
      await api.post('/transactions/import', data);
      toast.success('Registros importados com suceso!');

      setUploadedFiles([]);
      history.push('/');
    } catch (err) {
      toast.error('Falha ao importar registro, tente novamente!');
    }
  }

  function submitFile(files: File[]): void {
    const newFile: FileProps = {
      file: files[0],
      name: files[0].name,
      readableSize: filesize(files[0].size),
    };

    setUploadedFiles([newFile]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
