'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as actions from './actions';
import PageView from './PageView';

const Page = () => {
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testString, setTestString] = useState('');
  const [testResult, setTestResult] = useState(null);

  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    actions.fetchAutomate(id, setAutomate, setGraph, setError, setIsLoading);
  }, [id]);

  const handleDelete = () => actions.handleDelete(id, router, setError);
  const handleTestString = () => actions.handleTestString(id, testString, setTestResult, setError);
  const handleConvertToRegex = () => actions.handleConvertToRegex(id, setError);
  const handleConvertToAFD = () => actions.handleConvertToAFD(id, setAutomate, setGraph, setError, setIsLoading);
  const handleCompleteAFD = () => actions.handleCompleteAFD(id, setAutomate, setGraph, setError, setIsLoading);
  const handleStateAnalysis = () => actions.handleStateAnalysis(id, setError);
  const handleEmondage = () => actions.handleEmondage(id, setAutomate, setGraph, setError, setIsLoading);

  return (
    <PageView
      automate={automate}
      graph={graph}
      error={error}
      isLoading={isLoading}
      testString={testString}
      testResult={testResult}
      setTestString={setTestString}
      handleDelete={handleDelete}
      handleTestString={handleTestString}
      handleConvertToRegex={handleConvertToRegex}
      handleConvertToAFD={handleConvertToAFD}
      handleCompleteAFD={handleCompleteAFD}
      handleStateAnalysis={handleStateAnalysis}
      handleEmondage={handleEmondage}
      router={router}
    />
  );
};

export default Page;