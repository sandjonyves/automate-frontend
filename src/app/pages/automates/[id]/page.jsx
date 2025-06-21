'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAutomate } from '@/app/services/fetchAutomate';
import { handleDelete } from '@/app/services/deleteAutomate';
import { handleTestString } from '@/app/services/testString';
import { handleConvertToRegex } from '@/app/services/convertToRegex';
import { handleConvertToAFD, handleCompleteAFD, handleFromEpsilonAFNToAFD } from '@/app/services/convertToAFD';
import { handleConvertToAFN, handleConvertToEpsilonAFN, handleFromEpsilonAFN } from '@/app/services/convertToAFN';
import { handleStateAnalysis } from '@/app/services/stateAnalysis';
import { handleEmondage } from '@/app/services/emondage';
import { handleEpsilonClosure } from '@/app/services/epsilonClosure';
import { handleAFDToEpsilonAFN } from '@/app/services/afdToEpsilonAFN';
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
    fetchAutomate(id, setAutomate, setGraph, setError, setIsLoading);
  }, [id]);

  return (
    <PageView
      automate={automate}
      graph={graph}
      error={error}
      isLoading={isLoading}
      testString={testString}
      testResult={testResult}
      setTestString={setTestString}
      handleDelete={() => handleDelete(id, router, setError)}
      handleTestString={() => handleTestString(id, testString, setTestResult, setError)}
      handleConvertToRegex={() => handleConvertToRegex(id, setError)}
      handleConvertToAFD={() => handleConvertToAFD(id, setAutomate, setGraph, setError, setIsLoading)}
      handleCompleteAFD={() => handleCompleteAFD(id, setAutomate, setGraph, setError, setIsLoading)}
      handleStateAnalysis={() => handleStateAnalysis(id, setError)}
      handleEmondage={() => handleEmondage(id, setAutomate, setGraph, setError, setIsLoading)}
      handleConvertToAFN={() => handleConvertToAFN(id, setAutomate, setGraph, setError, setIsLoading)}
      handleConvertToEpsilonAFN={() => handleConvertToEpsilonAFN(id, setAutomate, setGraph, setError, setIsLoading)}
      handleFromEpsilonAFN={() => handleFromEpsilonAFN(id, setAutomate, setGraph, setError, setIsLoading)}
      handleEpsilonClosure={(stateName) => handleEpsilonClosure(id, stateName, setError)}
      handleFromEpsilonAFNToAFD={() => handleFromEpsilonAFNToAFD(id, setAutomate, setGraph, setError, setIsLoading)}
      handleAFDToEpsilonAFN={() => handleAFDToEpsilonAFN(id, setAutomate, setGraph, setError, setIsLoading)}
      router={router}
    />
  );
};

export default Page;