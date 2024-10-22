import { Request, Response } from "express";
import pdf from "pdf-parse";
import fs from "fs";
import path from "path";
import { prisma } from "../utilities/prisma";
import { marked } from "marked";

interface IDocumentTitle {
  Title: string;
}

interface INewDocument {
  status: string;
  document: {
    name: string;
    text: string;
    path: string;
  };
}

interface IFindDocument {
  filepath: string;
}

export const UploadFileAndConvertToText = async (
  req: Request,
  res: Response<INewDocument>
) => {
  try {
    let dataBufffer = fs.readFileSync(
      path.join(__dirname, `../files/${req.file?.filename}`)
    );

    const data = await pdf(dataBufffer);

    console.log(data);

    const newDocument = await prisma.document.create({
      data: {
        name: (<IDocumentTitle>data.info).Title || "",
        path: <string>req.file?.filename,
        text: data.text,
      },
    });

    return res.status(201).json({
      status: "success",
      document: {
        name: newDocument.name,
        text: newDocument.text,
        path: newDocument.path,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const SaveMarkDownText = async (req: Request, res: Response) => {
  const { filepath } = <IFindDocument>req.body;

  try {
    const findDocument = await prisma.document.findFirst({
      where: {
        path: filepath,
      },
    });

    const markdownParsed = await marked.parse(<string>findDocument?.text);

    return res.status(200).json({
      status: "success",
      data: {
        text: markdownParsed,
      },
    });
  } catch (e) {
    console.log(e);
  }
};
