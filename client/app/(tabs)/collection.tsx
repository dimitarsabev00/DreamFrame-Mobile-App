import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'expo-router';
import GlobalApi from '../../services/GlobalApi';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
export default function CollectionTab() {
    const [pageSize, setPageSize] = useState(5);
    const [loading, setLoading] = useState(false);
    const [aiImageList, setAiImageList] = useState([])
    const router = useRouter();
    const ColumnWidth = Dimensions.get('screen').width * 0.86 / 2;
    const { user } = useUser();
    const [metaData, setMetaData] = useState();

    useEffect(() => {
        // setAiImageList([])
        user && GetAllAiImages(pageSize);
    }, [user])
    /**
     * used to Fetch all User Images
     */
    
    const GetAllAiImages = async (size) => {

        if (metaData?.total <= aiImageList.length) {
            return;
        }
        setLoading(true)

        const result = await GlobalApi.GetUsersAiImages(size, user?.primaryEmailAddress?.emailAddress);
        console.log("ALL Images", result.data.meta.pagination);
        const resultData = result.data.data;

        setMetaData(result.data.meta.pagination)
        resultData?.forEach(element => {
            setAiImageList(prev => [...prev, element]);
        })
        setLoading(false);
    }

    const RenderFoot = () => {
        if (loading) {
            return <ActivityIndicator size={'large'} color={Colors.PRIMARY} />
        }
        return null;
    }

    const onImageClickHandle = (item) => {
        router.push({
            pathname: 'viewAiImage',
            params: {
                imageUrl: item.imageUrl,
                prompt: 'Hidden'
            }
        })
    }
    return (
        <View style={{
            padding: 20,
            marginTop: 20
        }}>
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold'
            }}>My Collection</Text>

            <FlatList
                data={aiImageList}
                numColumns={2}
                onEndReached={() =>GetAllAiImages(pageSize + 5)}
                onEndReachedThreshold={0.7}
                ListFooterComponent={RenderFoot}
                onRefresh={()=>GetAllAiImages(5)}
                refreshing={loading}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => onImageClickHandle(item)}
                        style={{
                            margin: 5
                        }}>
                        <Image source={{ uri: item?.imageUrl.replace('/upload','/upload/c_limit,h_300,w_300') }}
                            style={{
                                width: ColumnWidth,
                                height: 250,
                                borderRadius: 15
                            }}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}