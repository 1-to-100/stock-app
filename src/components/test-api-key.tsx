"use client";
import {FC} from 'react';

type TestApiKeyProps = {};

export const TestApiKey: FC<TestApiKeyProps> = ({}) => {
    console.log("TestApiKey", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    return (
        <div>
            {process.env.NEXT_PUBLIC_FIREBASE_API_KEY}
        </div>
    );
};
