/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved.
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

import { MetricDataRecord, MetricType, TrialJobInfo } from './datastore';
import { TrialJobStatus } from './trainingService';

type ProfileUpdateType = 'TRIAL_CONCURRENCY' | 'MAX_EXEC_DURATION' | 'SEARCH_SPACE';

interface ExperimentParams {
    authorName: string;
    experimentName: string;
    trialConcurrency: number;
    maxExecDuration: number; //seconds
    maxTrialNum: number;
    searchSpace: string;
    tuner: {
        className: string;
        builtinTunerName?: string;
        codeDir?: string;
        classArgs?: any;
        classFileName?: string;
        checkpointDir: string;
        gpuNum?: number;
    };
    assessor?: {
        className: string;
        builtinAssessorName?: string;
        codeDir?: string;
        classArgs?: any;
        classFileName?: string;
        checkpointDir: string;
        gpuNum?: number;
    };
    clusterMetaData?: {
        key: string;
        value: string;
    }[];
}

interface ExperimentProfile {
    params: ExperimentParams;
    id: string;
    execDuration: number;
    startTime?: Date;
    endTime?: Date;
    revision: number;
}

interface TrialJobStatistics {
    trialJobStatus: TrialJobStatus;
    trialJobNumber: number;
}

abstract class Manager {
    public abstract startExperiment(experimentParams: ExperimentParams): Promise<string>;
    public abstract resumeExperiment(): Promise<void>;
    public abstract stopExperiment(): Promise<void>;
    public abstract getExperimentProfile(): Promise<ExperimentProfile>;
    public abstract updateExperimentProfile(experimentProfile: ExperimentProfile, updateType: ProfileUpdateType): Promise<void>;

    public abstract addCustomizedTrialJob(hyperParams: string): Promise<void>;
    public abstract cancelTrialJobByUser(trialJobId: string): Promise<void>;

    public abstract listTrialJobs(status?: TrialJobStatus): Promise<TrialJobInfo[]>;
    public abstract getTrialJob(trialJobId: string): Promise<TrialJobInfo>;
    public abstract setClusterMetadata(key: string, value: string): Promise<void>;
    public abstract getClusterMetadata(key: string): Promise<string>;

    public abstract getMetricData(trialJobId: string, metricType: MetricType): Promise<MetricDataRecord[]>;
    public abstract getTrialJobStatistics(): Promise<TrialJobStatistics[]>;
}

export { Manager, ExperimentParams, ExperimentProfile, TrialJobStatistics, ProfileUpdateType };
