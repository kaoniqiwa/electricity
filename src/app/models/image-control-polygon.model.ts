import { Point } from './point.model';

/** 事件目标 */
export interface ImageControlPolygon {
  /**	String	目标ID	M */
  Id: string;
  /**	Point[]	目标所在的归一化多边形	M */
  Polygon: Point[];
  /**	Double	置信度：0-100	M */
  Confidence: number;
}
