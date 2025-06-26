'use client';

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
import { handleMinimizeAFD } from '@/app/services/minimizeAFD';
import { handleCanonizeAutomate } from '@/app/services/canonizeAutomate';
import { handleRegexToEpsilonAFN } from '@/app/services/regexToEpsilonAFN';
import { handleBuildAutomaton } from '@/app/services/buildAutomaton';
import { handleComplement } from '@/app/services/complement'; // Ajout de l'import
import PageView from './PageView';

const Page = () => {
  const [automate, setAutomate] = useState(null);
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [testString, setTestString] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [regexInput, setRegexInput] = useState('');
  const [glushkovRegexInput, setGlushkovRegexInput] = useState('');
  const [automatonInput, setAutomatonInput] = useState('');
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchAutomate(id, setAutomate, setGraph, setError, setIsLoading);
    }
  }, [id]);

  return (
    <PageView
      automate={automate}
      graph={graph}
      error={error}
      setError={setError}
      isLoading={isLoading}
      testString={testString}
      testResult={testResult}
      setTestString={setTestString}
      regexInput={regexInput}
      automatonInput={automatonInput}
      setAutomatonInput={setAutomatonInput}
      setRegexInput={setRegexInput}
      glushkovRegexInput={glushkovRegexInput}
      setGlushkovRegexInput={setGlushkovRegexInput}
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
      handleEpsilonClosure={(id, stateName, setError) => handleEpsilonClosure(id, stateName, setError)}
      handleFromEpsilonAFNToAFD={() => handleFromEpsilonAFNToAFD(id, setAutomate, setGraph, setError, setIsLoading)}
      handleAFDToEpsilonAFN={() => handleAFDToEpsilonAFN(id, setAutomate, setGraph, setError, setIsLoading)}
      handleMinimizeAFD={() => handleMinimizeAFD(id, setAutomate, setGraph, setError, setIsLoading)}
      handleCanonizeAutomate={() => handleCanonizeAutomate(id, setAutomate, setGraph, setError, setIsLoading)}
      handleRegexToEpsilonAFN={() => handleRegexToEpsilonAFN(regexInput, setAutomate, setGraph, setError, setIsLoading)}
      handleBuildAutomaton={() => handleBuildAutomaton(glushkovRegexInput, setAutomate, setGraph, setError, setIsLoading)}
      handleComplement={() => handleComplement(id, setAutomate, setGraph, setError, setIsLoading)} // Ajout de la prop
      router={router}
    />
  );
};

export default Page;