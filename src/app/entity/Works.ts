export interface Works{
	id: number;
	title: string;
	content: string;
	style: string;
	authorId: number;
	authorStuId: string;
	enable: boolean;
	submit: boolean;
	waitEdit: boolean;
	createdTime: Date;
	latestContent: string;
	latestModifyTime: Date;
	editorId: number;
	editorName: string;
	editedTime: Date;
    editorScore: number;
    editorReason: string;
    editorId2: number;
	editorName2: string;
	editedTime2: Date;
    editorScore2: number;
    editorReason2: string;

}
