
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

interface Row {
    key: string;
    value: string;
}

const GrafQlContent = () => {

    const searchParam = useSearchParams();
    const otherParams = searchParam.toString();
    console.log("SSS", otherParams)
    const t = useTranslations("HomePage");
    const localActive = useLocale();
    const [url, setUrl] = useState("");
    const [schema, setSchema] = useState("query {}");
    const [variables, setVariables] = useState<string>("{}");
    const [headers, setHeaders] = useState<string>("{}");
    const [rows, setRows] = useState<Row[]>([{ key: '', value: '' }]);

    const router = useRouter();
    const [data, setData] = useState<string | null>("");
    const [statusCode, setStatusCode] = useState<number | null>(null);






    useEffect(() => {

        const parseParams = () => {
            const params = new URLSearchParams(searchParam.toString());
            
            const result: Row[] = []
            for (const [key, value] of params.entries()) {
                if (key) {
                    result.push({ key, value });
                }
            }
            result.push({ key: "", value: "" })
            setRows(result);
        };

        parseParams();
    }, [searchParam]);


    const encodeBase64 = (input: string) => {
        return Buffer.from(input).toString('base64');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const encodedUrl = encodeBase64(url);
        const requestBody = JSON.stringify({
            schema,
            variables: JSON.parse(variables),
        });
        const encodedBody = encodeBase64(requestBody);

        const parsedHeaders = JSON.parse(headers);
        const queryParams = new URLSearchParams(parsedHeaders).toString();

        const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
                uri: url,
                headers: JSON.parse(headers),
            }),
        });

        const CustomQuery = graphql(schema);

        const operationType = schema.includes("query") ? "query" : "mutation";
        try {
            const parsedVariables = JSON.parse(variables);

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
            localStorage.setItem("graphiql", JSON.stringify({ url: graphqlUrl, response: response!.data }));
        } catch (error: any) {
            console.error("Ошибка запроса:", error);
            setStatusCode(error.networkError?.statusCode || 500);
        }

        router.push(graphqlUrl);
    };

    const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    const handleChangeHeaders = (headers: Row[]) => {
        setRows(headers);
        let obj: { [key: string]: string } = {};
        Object.values(headers).forEach(item => {
            obj[item.key] = item.value;
        });
        setHeaders(JSON.stringify(obj));
    };

    const handleChangeSchema = (value: string) => {
        setSchema(value);
    };

    const handleChangeVariables = (value: string) => {
        setVariables(value);
    };

    return (
        <section className={styles.content}>
            <div className={styles.content__inner}>
                <form className={styles.content__form} onSubmit={handleSubmit}>
                    <h1 className={styles.content__title}>GraphiQl Client</h1>
                    <GraphiQlUrlEditor handleChangeUrl={handleChangeUrl} />
                    <div className={styles.content__background} />
                    <div className={styles.content__field}>
                        <p className={styles.content__field__title}></p>
                    </div>
                    <HeadersPlayground title={"Headers"} handleChangeHeaders={handleChangeHeaders} rows={rows} />
                    <BodyCodePlayground title={"Query"} handleChangeField={handleChangeSchema} code={schema} />
                    <BodyCodePlayground title={"Variables"} handleChangeField={handleChangeVariables} code={variables} />
                </form>

                <div className={styles.response}>
                    <p className={styles.response__title}>Response</p>
                    <div className={styles.response__status}>
                        <p className={styles.response__status__text}>Status:</p>
                        <div className={styles.response__status__code}>
                            {statusCode !== null ? statusCode : "N/A"}
                        </div>
                    </div>
                    <ResponseCodePlayground title={"Body"} response={String(data)} />
                </div>
            </div>
        </section>
    );
};

export default GrafQlContent;

/*
"use client";
import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { graphql } from "gql.tada";
import { useRouter,  useSearchParams  } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";




import BodyCodePlayground from "../BodyCodePlayGround/BodyCodePlayground";
import GraphiQlUrlEditor from "../GraphiQlUrlEditor/GraphiQlUrlEditor";
import HeadersPlayground from "../HeadersPlayground/HeadersPlayground";
import styles from "./GraphQlContent.module.scss"
import ResponseCodePlayground from "../ResponseCodePlayGround/ResponseCodePlayGround";
interface Row {
    key: string;
    value: string;
}

const GrafQlContent = () => {

    const searchParam = useSearchParams()
    const t = useTranslations("HomePage");
    const localActive = useLocale();
    const [url, setUrl] = useState("");
    const [schema, setSchema] = useState("query {}");
    const [variables, setVariables] = useState<string>("{}");
    const [headers, setHeaders] = useState<string>("{}");
    const [rows, setRows] = useState<Row[]>([{ key: '', value: '' }]);


    const router = useRouter();

    const encodeBase64 = (input: string) => {
        return Buffer.from(input).toString('base64');
    };
    const [data, setData] = useState<string | null>("")



    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const encodedUrl = encodeBase64(url);
        const requestBody = JSON.stringify({
            schema,
            variables: JSON.parse(variables),
        });
        const encodedBody = encodeBase64(requestBody);


        const parsedHeaders = JSON.parse(headers);
        const queryParams = new URLSearchParams(parsedHeaders).toString();

        const graphqlUrl = `/${localActive}/GRAPHQL/${encodedUrl}/${encodedBody}?${queryParams}`;

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link: new HttpLink({
                uri: url,
                headers: JSON.parse(headers),
            }),
        });



        const CustomQuery = graphql(schema);

        const operationType = schema.includes("query") ? "query" : "mutation"
        try {
            const parsedVariables = JSON.parse(variables);

            if (operationType === 'query') {
                const { data } = await client.query({
                    query: CustomQuery,
                    variables: parsedVariables,
                    context: {
                        fetchOptions: {
                            next: { revalidate: 10 },
                        },
                    },
                });
                setData(data)
            
                localStorage.setItem("graphiql", JSON.stringify({ url: graphqlUrl, response: data }));
            } else if (operationType === 'mutation') {
                const { data } = await client.mutate({
                    mutation: CustomQuery,
                    variables: parsedVariables,
                    context: {
                        fetchOptions: {
                            next: { revalidate: 10 },
                        },
                    },
                });
                localStorage.setItem("graphiql", JSON.stringify({ url: graphqlUrl, response: data }));
            } else {
                console.error("Unsupported operation type:", operationType);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
router.push(graphqlUrl)
       

    };
    useEffect(() => {
        //setData(localStorage.getItem('graphiql'))

    }, [handleSubmit, router])
useEffect(()=> {

}, [])
 

    const handleChangeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value)
    }
    
    const handleChangeHeaders = (headers: Row[]) => {

        setRows(headers)
        let obj: { [key: string]: string } = {}
        Object.values(headers).forEach(item => {
            obj[item.key] = item.value;
        })
        
    //    setHeaders(String(obj))
    }

    const handleChangeSchema = (value: string) => {
        setSchema(value)
    }
    const handleChangeVariables = (value: string) => {
        setVariables(value)
    }
    return (<>
        <section className={styles.content}>
            <div className={styles.content__inner}>
                <form className={styles.content__form} onSubmit={handleSubmit} >

                    <h1 className={styles.content__title}>
                        GraphiQl Client
                    </h1>
                    <GraphiQlUrlEditor handleChangeUrl={handleChangeUrl} />
                    <div className={styles.content__background} />
                    <div className={styles.content__field}>
                        <p className={styles.content__field__title}>
                        </p>
                    </div>
                    <HeadersPlayground title={"Headers"} handleChangeHeaders={handleChangeHeaders} rows={rows} />
                    <BodyCodePlayground title={"Query"} handleChangeField={handleChangeSchema} code={schema} />
                    <BodyCodePlayground title={"Variables"} handleChangeField={handleChangeVariables} code={variables} />
                </form>

                <div className={styles.response}>
                    <p className={styles.response__title}>
                        Response
                    </p>
                    <div className={styles.response__status}>
                        <p className={styles.response__status__text}>
                            Status:
                        </p>
                        <div className={styles.response__status__code}>
                            200
                        </div>
                    </div>
                    <ResponseCodePlayground title={"Body"} response={String(data)} />

                </div>

            </div>
        </section>
    </>);
}

export default GrafQlContent;
 */