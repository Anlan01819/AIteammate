# Netlify����ָ��

## �Զ�����

����Ŀ������Ϊ����ֱ�Ӳ���Netlify���������²��������

1. ��Netlify�ϴ����˻�����¼
2. ���"New site from Git"
3. ѡ������Git�ṩ�̣�GitHub��GitLab��Bitbucket��
4. ��ȨNetlify�������Ĳֿ�
5. ѡ���������Ŀ�Ĳֿ�
6. ���ù���ѡ�
   - ��������Զ�ʹ�� `npm run build`
   - ����Ŀ¼���Զ�ʹ�� `dist`
7. ���"Deploy site"

## �ֶ�����

��������ֶ������밴�����²��������

1. �ڱ��ع�����Ŀ
   ```
   npm run build
   ```

2. ��`dist`Ŀ¼�ϴ���Netlify
   - ��¼Netlify
   - ת��"Sites"ҳ��
   - ��`dist`�ļ����Ϸŵ�ָ������

## ����������

### ����ʧ��

����������������´���
```
������Ϣ
����ʧ�ܣ��˳�����1��cd client & npm install & npm run build
```

���������ΪNetlify�Ĺ������ò���ȷ����ȷ����

1. ��Netlify��վ�������У�ת��"Build & deploy" > "Build settings"
2. ȷ�Ϲ�������Ϊ `npm run build`
3. ȷ�Ϸ���Ŀ¼Ϊ `dist`
4. �����֮ǰ�������Զ��幹�������� `cd client & npm install & npm run build`���뽫�����Ϊ `npm run build`

### ·������

����������ˢ��ҳ���ֱ�ӷ���URL·������404����ȷ����

1. `public/_redirects` �ļ������Ұ��� `/* /index.html 200`
2. ����ȷ�� `netlify.toml` �ļ��а�����ȷ���ض������

## ��������

���������Ŀ��Ҫ��������������Netlify��վ�������е�"Build & deploy" > "Environment"����������ǡ�