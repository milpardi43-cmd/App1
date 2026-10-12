import { Colors, LtrDirection, Spacing, Radius, Typography } from '@/lib/theme';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import { GermanBottomNav } from './GermanBottomNav';
import { RussianBottomNav } from './RussianBottomNav';
/** Shared presentation shell for the German and Russian starter routes; English screens remain independent. */
export function CoursePage({title,subtitle,children,back='/languages',progress,footer}:{title:string;subtitle?:string;children:ReactNode;back?:string;progress?:number;footer?:ReactNode}){
 const pathname=usePathname();const {language}=useLocalSearchParams<{language?:string}>();const activeLanguage=language??(pathname.startsWith('/learn/ru')?'ru':pathname.startsWith('/learn/de')?'de':undefined);
 return <View style={courseStyles.root}>
  <View style={courseStyles.header}><PageNavigation tone="dark" backFallback={back}/><View style={{flex:1}}><Text style={courseStyles.title}>{title}</Text>{subtitle&&<Text style={courseStyles.description}>{subtitle}</Text>}</View>{progress!==undefined&&<Text style={courseStyles.pill}>{Math.round(progress*100)}٪</Text>}</View>
  {progress!==undefined&&<View style={courseStyles.track}><View style={[courseStyles.fill,{width:`${Math.min(1,Math.max(0,progress))*100}%`}]}/></View>}
  <ScrollView contentContainerStyle={courseStyles.page}><View style={courseStyles.content}>{children}</View></ScrollView>
  {footer&&<View style={courseStyles.footer}>{footer}</View>}
  {activeLanguage==='de'&&progress===undefined&&<GermanBottomNav/>}
  {activeLanguage==='ru'&&progress===undefined&&<RussianBottomNav/>}
 </View>;
}
export function CourseButton({title,onPress,disabled=false,secondary=false}:{title:string;onPress:()=>void;disabled?:boolean;secondary?:boolean}){
 return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[courseStyles.button,secondary&&{backgroundColor:Colors.neutral[800]},disabled&&{opacity:.4}]}><Text style={[courseStyles.buttonText,secondary&&{color:Colors.primary[300]}]}>{title}</Text></Pressable>;
}
export const courseStyles=StyleSheet.create({
 root:{flex:1,backgroundColor:Colors.neutral[950]},header:{paddingTop:52,paddingHorizontal:Spacing.lg,paddingBottom:Spacing.md,flexDirection:'row-reverse',gap:Spacing.md,alignItems:'center',backgroundColor:Colors.neutral[900]},footer:{padding:Spacing.md,backgroundColor:Colors.neutral[900],borderTopWidth:1,borderTopColor:Colors.neutral[800]},
 page:{flexGrow:1,padding:Spacing.lg,paddingBottom:40},content:{...LtrDirection,width:'100%',gap:20},back:{width:40,height:40,borderRadius:Radius.md,backgroundColor:Colors.neutral[850],justifyContent:'center',alignItems:'center'},title:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:Typography.sizes.lg,fontWeight:'700',color:Colors.neutral[100],textAlign:'right'},description:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:14,color:Colors.neutral[300],textAlign:'right',lineHeight:28},small:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:12,color:Colors.neutral[400],textAlign:'right',lineHeight:24},card:{padding:Spacing.lg,backgroundColor:Colors.neutral[850],borderRadius:Radius.xl,borderWidth:1,borderColor:Colors.neutral[800],gap:18},heading:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:18,fontWeight:'700',color:Colors.neutral[100],textAlign:'right'},target:{fontSize:25,fontWeight:'600',color:Colors.neutral[50],textAlign:'left',writingDirection:'ltr',lineHeight:37},pronunciation:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:13,color:Colors.primary[300],textAlign:'right',lineHeight:25},button:{padding:16,minHeight:50,backgroundColor:Colors.accent[500],borderRadius:Radius.lg,alignItems:'center'},buttonText:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:14,fontWeight:'700',color:Colors.onColor},row:{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'},pill:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:12,color:Colors.primary[300],backgroundColor:Colors.neutral[800],padding:9,borderRadius:9},notice:{writingDirection:'rtl',fontFamily:Typography.fontFamily,fontSize:12,color:Colors.warning[300],backgroundColor:Colors.warning[500]+'10',padding:16,borderRadius:12,textAlign:'right',lineHeight:26},error:{writingDirection:'rtl',fontFamily:Typography.fontFamily,color:Colors.error[300],textAlign:'right',lineHeight:26},track:{height:4,backgroundColor:Colors.neutral[800],alignItems:'flex-end',overflow:'hidden'},fill:{height:4,backgroundColor:Colors.accent[500]},word:{fontSize:20,color:Colors.neutral[100],textAlign:'left',writingDirection:'ltr'},divider:{height:1,backgroundColor:Colors.neutral[700]},
});
