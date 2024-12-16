import React from 'react';

interface HTMLRendererProps {
    htmlContent: string;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ htmlContent }) => {
    return (
        <div  className='text-start w-100'
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
            style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }} 
        />
    );
};

export default HTMLRenderer;