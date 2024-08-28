"use client";
import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";

import BodyCodePlayground from "../BodyCodePlayGround/BodyCodePlayground";
import GraphiQlUrlEditor from "../GraphiQlUrlEditor/GraphiQlUrlEditor";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import styles from "./GraphQlContent.module.scss";
import ResponseCodePlayground from "../ResponseCodePlayGround/ResponseCodePlayGround";
import { usePathname } from 'next/navigation';

interface Row {
    key: string;
    value: string;
}

const GrafQlContent = () => {
    const pathname = usePathname();
    const searchParam = useSearchParams();

    const t = useTranslations("HomePage");
    const localActive = useLocale();

    const [requestData, setRequestData] = useState({
        url: "",
        schema: "query {}",
        variables: "{}",
        headers: "{}",
    });

    const [rows, setRows] = useState<Row[]>([{ key: '', value: '' }]);

    const router = useRouter();
    const [data, setData] = useState<string | null>("");
    const [statusCode, setStatusCode] = useState<number | null>(null);

    const encodeBase64 = (input: string) => {
        return Buffer.from(input).toString('base64');
    };

    const decodeBase64 = (input: string) => {
        return Buffer.from(input, 'base64').toString('utf-8');
    };

    useEffect(() => {
        const segments = pathname.split('/');
        const bodyBase64String = segments.pop();
        const endpointBase64String = segments.pop();

        if (endpointBase64String && bodyBase64String) {
            try {
                const decodedUrl = decodeBase64(endpointBase64String);
                const decodedBody = decodeBase64(bodyBase64String);

                const bodyJson = JSON.parse(decodedBody);
                setRequestData((prevState) => ({
                    ...prevState,
                    url: decodedUrl,
                    schema: bodyJson.query || "query {}",
                    variables: JSON.stringify(bodyJson.variables || {}, null, 2),
                }));


                const params = new URLSearchParams(searchParam.toString());

                const result: Row[] = [];
                for (const [key, value] of params.entries()) {
                    if (key) {
                        result.push({ key, value });
                    }
                }
                result.push({ key: "", value: "" });
                setRows(result);
                const handleReceive = async () => {

                    const client = new ApolloClient({
                        cache: new InMemoryCache(),
                        link: new HttpLink({
                            uri: decodedUrl,
                            //      headers:  JSON.stringify(result)
                            //      headers: parsedHeaders,
                        }),
                    });

                    const CustomQuery = graphql(bodyJson.query);

                    const operationType = bodyJson.query.includes("query") ? "query" : "mutation";
                    try {
                        const parsedVariables = JSON.parse(JSON.stringify(bodyJson.variables || {}, null, 2));

                        let response;
                        if (operationType === 'query') {
                            response = await client.query({
                                query: CustomQuery,
                                variables: parsedVariables,
                                context: {
                                    fetchOptions: {
                                        next: { revalidate: 10 },
                                    },
                                },
                            });
                        } else if (operationType === 'mutation') {
                            response = await client.mutate({
                                mutation: CustomQuery,
                                variables: parsedVariables,
                                context: {
                                    fetchOptions: {
                                        next: { revalidate: 10 },
                                    },
                                },
                            });
                        } else {
                            console.error("Unsupported operation type:", operationType);
                        }

                        setData(response!.data);
                        setStatusCode(200);
                    } catch (error: any) {
                        console.error("Ошибка запроса:", error);
                        setStatusCode(error.networkError?.statusCode || 500);
                    }
                    /*
                        */
                }
                handleReceive()


            } catch (error) {
                console.error('Ошибка при декодировании или парсинге:', error);
            }
         
        }
      
    }, [pathname, searchParam]);


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { url, schema, variables, headers } = requestData;
        const encodedUrl = encodeBase64(url);

        const requestBody = JSON.stringify({
            query: schema,
            variables: JSON.parse(variables),
        });
        const encodedBody = encodeBase64(requestBody);

        const parsedHeaders = JSON.parse(headers);
        const queryParams = new URLSearchParams(parsedHeaders).toString();

        const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;
        router.push(graphqlUrl);
    };

    const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRequestData((prevState) => ({
            ...prevState,
            url: event.target.value,
        }));
    };

    const handleChangeHeaders = (headers: Row[]) => {
        setRows(headers);
        let obj: { [key: string]: string } = {};
        Object.values(headers).forEach(item => {
            if (item.key) {
                obj[item.key] = item.value;
            }
        });
        setRequestData((prevState) => ({
            ...prevState,
            headers: JSON.stringify(obj),
        }));
    };

    const handleChangeSchema = (value: string) => {
        setRequestData((prevState) => ({
            ...prevState,
            schema: value,
        }));
    };

    const handleChangeVariables = (value: string) => {
        setRequestData((prevState) => ({
            ...prevState,
            variables: value,
        }));
    };

    return (
        <section className={styles.content}>
            <div className={styles.content__inner}>
                <form className={styles.content__form} onSubmit={handleSubmit}>
                    <h1 className={styles.content__title}>GraphiQl Client</h1>
                    <GraphiQlUrlEditor handleChangeUrl={handleChangeUrl} url={requestData.url}
                    />
                    <div className={styles.content__background} />
                    <div className={styles.content__field}>
                        <p className={styles.content__field__title}></p>
                    </div>
                    <HeadersPlayground title={"Headers"} handleChangeHeaders={handleChangeHeaders} rows={rows} />
                    <BodyCodePlayground title={"Query"} handleChangeField={handleChangeSchema} code={requestData.schema} />
                    <BodyCodePlayground title={"Variables"} handleChangeField={handleChangeVariables} code={requestData.variables} />
                </form>

                <div className={styles.response}>
                    <p className={styles.response__title}>Response</p>
                    <div className={styles.response__status}>
                        <p className={styles.response__status__text}>Status:</p>
                        <div className={styles.response__status__code}>
                            {statusCode !== null ? statusCode : "N/A"}
                        </div>
                    </div>
                    <ResponseCodePlayground title={"Body"} response={JSON.stringify(data)} />
                </div>
            </div>
        </section>
    );
};

export default GrafQlContent;
