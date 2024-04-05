import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CKEditorField = ({ data, onBlur, readOnly, loading, saved }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      onReady={editor => {
        // Puedes usar el editor aquí
      }}
      disabled={readOnly}
      onBlur={(event, editor) => {
        const data = editor.getData();
        onBlur(data); // Envía el valor actualizado al componente padre
      }}
      // Puedes agregar más eventos según necesites
    />
  );
};

export default CKEditorField;
