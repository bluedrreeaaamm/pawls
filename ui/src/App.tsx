/**
 * This is the top-level component that defines your UI application.
 *
 * This is an appropriate spot for application wide components and configuration,
 * stuff like application chrome (headers, footers, navigation, etc), routing
 * (what urls go where), etc.
 *
 * @see https://github.com/reactjs/react-router-tutorial/tree/master/lessons
 */

import React, { useEffect, useMemo, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Result, Spin } from '@allenai/varnish';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { PDFPage } from './pages';
import { CenterOnPage } from './components';
import { getAllocatedPaperStatus, PaperStatus } from './api';

const RedirectToFirstPaper = () => {
    const [papers, setPapers] = useState<PaperStatus[] | null>(null);

    useEffect(() => {
        getAllocatedPaperStatus().then((allocation) => setPapers(allocation?.papers || []));
    }, []);

    const content = useMemo(() => {
        if (!papers) {
            return (
                <CenterOnPage>
                    <Spin size="large" />
                </CenterOnPage>
            );
        }

        /** First available sha */
        const sha = papers.find((p) => !!p.sha)?.sha;

        if (!papers.length || !sha) {
            return (
                <CenterOnPage>
                    <Result icon={<QuestionCircleOutlined />} title="PDFs Not Found" />
                </CenterOnPage>
            );
        }

        return <Navigate to={`/pdf/${sha}`} />;
    }, [papers]);

    return content;
};

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<RedirectToFirstPaper />} />
                    <Route path="/pdf/:sha" element={<PDFPage />} />
                </Routes>
            </BrowserRouter>
            <GlobalStyles />
        </>
    );
};

// Setup the viewport so it takes up all available real-estate.
const GlobalStyles = createGlobalStyle`
    html, body, #root {
        display: flex;
        flex-grow: 1;
    }
`;

export default App;
